use std::collections::HashMap;
use std::time::Duration;
use rand::distributions::Alphanumeric;
use rand::Rng;
use reqwest::{Client, header, StatusCode};
use reqwest::header::HeaderMap;
use crate::{TestResult, utils};

fn generate_accept_language() -> String {
    let mut rng = rand::thread_rng();
    let language_count = rng.gen_range(1..=5); // 随机生成1到5种语言
    let mut languages = Vec::new();

    for _ in 0..language_count {
        // 随机生成语言标签
        let rng = rand::thread_rng();
        let language: String = rng
            .sample_iter(&Alphanumeric)
            .take(2)
            .map(char::from)
            .collect();
        // 生成权重，格式化为小数点后两位
        let mut rng = rand::thread_rng();
        let weight: f32 = rng.gen_range(0.0..=1.0);
        if weight < 1.0 {
            languages.push(format!("{};q={:.2}", language, weight));
        } else {
            // 如果权重为1，则不需要q参数
            languages.push(language);
        }
    }

    languages.join(", ")
}

fn default_headers() -> HeaderMap {
    let mut headers = header::HeaderMap::new();
    headers.insert("Host", "api-ticketwaiting.interpark.com".parse().unwrap());
    headers.insert("sec-ch-ua", "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"".parse().unwrap());
    headers.insert("Accept", "application/json, text/plain, */*".parse().unwrap());
    headers.insert("sec-ch-ua-mobile", "?0".parse().unwrap());
    headers.insert("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36".parse().unwrap());
    headers.insert("sec-ch-ua-platform", "\"macOS\"".parse().unwrap());
    headers.insert("Origin", "https://ordo.interpark.com".parse().unwrap());
    headers.insert("Sec-Fetch-Site", "same-site".parse().unwrap());
    headers.insert("Sec-Fetch-Mode", "cors".parse().unwrap());
    headers.insert("Sec-Fetch-Dest", "empty".parse().unwrap());
    headers.insert("Referer", "https://ordo.interpark.com/".parse().unwrap());
    headers.insert("Accept-Language", generate_accept_language().parse().unwrap());
    headers.insert("dnt", "1".parse().unwrap());
    headers.insert("Connection", "close".parse().unwrap());
    headers
}

pub fn get_pcid() -> String {
    format!(
        "{}{}{}{}{}{}",
        utils::cur_mils(),
        utils::randint(1, 9),
        utils::randint(0, 9),
        utils::randint(0, 9),
        utils::randint(0, 9),
        utils::randint(0, 9)
    )
}

pub async fn to_create_session(product_id: &str, proxy: &str, timeout: u64) -> TestResult {
    let proxy = reqwest::Proxy::all(proxy).unwrap();
    let mut cookies = HashMap::new();
    cookies.insert("pcid".to_string(), get_pcid());
    let mut headers = default_headers();
    headers.insert(
        "accept",
        "application/json, text/plain, */*".parse().unwrap(),
    );
    headers.insert("origin", "https://ordo.interpark.com".parse().unwrap());
    headers.insert("referer", "https://ordo.interpark.com/".parse().unwrap());
    headers.insert("sec-fetch-site", "same-site".parse().unwrap());
    headers.insert("sec-fetch-mode", "cors".parse().unwrap());
    headers.insert("sec-fetch-dest", "empty".parse().unwrap());
    headers.insert(
        "cookie",
        utils::cookie_obj_to_str(&cookies)
            .parse()
            .unwrap(),
    );
    let uid = "53c24208f07494f621202ff46a947021";
    let create_url = format!(
        "https://api-ticketwaiting.interpark.com/v1/wyns/create/session/{}/{}?t={}",
        product_id, uid, utils::cur_mils().to_string().as_str(),
    );
    let start = std::time::SystemTime::now();
    let client = Client::builder()
        .trust_dns(true)
        .proxy(proxy)
        .timeout(Duration::from_secs(timeout))
        .default_headers(headers)
        .build()
        .unwrap();
    // 请求create session
    let res = client.get(create_url.as_str()).send().await;
    if res.is_err() {
        return TestResult {
            status: "TIMEOUT".to_string(),
            delay: None,
        };
    }
    let res = res.unwrap();
    let status = res.status();
    let res_text = res.text().await.unwrap();
    match status {
        StatusCode::OK => match res_text.is_empty() {
            false => {
                TestResult {
                    status: "OK".to_string(),
                    delay: Some(start.elapsed().unwrap().as_millis() as u64),
                }
            }
            true => {
                TestResult {
                    status: "BAN".to_string(),
                    delay: Some(start.elapsed().unwrap().as_millis() as u64),
                }
            }
        },
        StatusCode::FORBIDDEN => TestResult {
            status: "BAN".to_string(),
            delay: None,
        },
        _ => TestResult {
            status: "TIMEOUT".to_string(),
            delay: None,
        },
    }
}

pub async fn query_itp_index(proxy: &str, timeout: u64) -> TestResult {
    let url = "https://www.globalinterpark.com";
    let proxy = reqwest::Proxy::all(proxy).unwrap();
    let headers = default_headers();
    let client = Client::builder()
        .trust_dns(true)
        .proxy(proxy)
        .timeout(Duration::from_secs(timeout))
        .default_headers(headers)
        .build()
        .unwrap();
    let start = std::time::SystemTime::now();
    let t = client.get(url).send().await;
    if t.is_err() {
        return TestResult {
            status: "TIMEOUT".to_string(),
            delay: None,
        };
    }
    let resp = t.unwrap();
    let status = resp.status();
    let body = resp.text().await.unwrap();
    println!("{:?} {}", status, body);
    match status {
        StatusCode::OK => TestResult {
            status: "OK".to_string(),
            delay: Some(start.elapsed().unwrap().as_millis() as u64),
        },
        StatusCode::FORBIDDEN => TestResult {
            status: "BAN".to_string(),
            delay: None,
        },
        _ => TestResult {
            status: "TIMEOUT".to_string(),
            delay: None,
        },
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_query_itp_wait() {
        let proxy = "206.82.0.7:18640:bruchrim:3FSo0qe2l7";
        let split: Vec<&str> = proxy.split(':').collect();
        let proxy = format!("http://{}:{}@{}:{}", split[2], split[3], split[0], split[1]);
        let timeout = 30;
        let res = to_create_session("24003932", &proxy, timeout).await;
        println!("{:?}", res);
    }

    #[tokio::test]
    async fn test_query_itp_wait_unbanned() {
        let proxy = "175.197.89.39:40037:S8qHtpbq:aualR8tg";
        let split: Vec<&str> = proxy.split(':').collect();
        let proxy = format!("http://{}:{}@{}:{}", split[2], split[3], split[0], split[1]);
        let timeout = 30;
        let res = to_create_session("24003932", &proxy, timeout).await;
        println!("{:?}", res);
    }

    #[tokio::test]
    async fn test_query_itp_wait_local() {
        let proxy = "localhost:9090";
        let split: Vec<&str> = proxy.split(':').collect();
        let proxy = format!("http://{}:{}", split[0], split[1]);
        let timeout = 30;
        let res = to_create_session("24003932", &proxy, timeout).await;
        println!("{:?}", res);
    }

    #[tokio::test]
    async fn test_query_itp_wait_banned() {
        let proxy = "206.82.0.17:30793:bruchrim:3FSo0qe2l7";
        let split: Vec<&str> = proxy.split(':').collect();
        let proxy = format!("http://{}:{}@{}:{}", split[2], split[3], split[0], split[1]);
        let timeout = 30;
        let res = query_itp_index(&proxy, timeout).await;
        println!("{:?}", res);
    }
}

