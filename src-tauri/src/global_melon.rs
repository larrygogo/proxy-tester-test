use std::time::Duration;
use reqwest::{Client, header, StatusCode};
use reqwest::header::HeaderMap;

use crate::TestResult;

fn default_headers() -> HeaderMap {
    let mut headers = header::HeaderMap::new();
    headers.insert("Host", "tkglobal.melon.com".parse().unwrap());
    headers.insert("Connection", "keep-alive".parse().unwrap());
    headers.insert("sec-ch-ua", "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"".parse().unwrap());
    headers.insert("sec-ch-ua-mobile", "?0".parse().unwrap());
    headers.insert("sec-ch-ua-platform", "\"macOS\"".parse().unwrap());
    headers.insert("Upgrade-Insecure-Requests", "1".parse().unwrap());
    headers.insert("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36".parse().unwrap());
    headers.insert("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7".parse().unwrap());
    headers.insert("Sec-Fetch-Site", "none".parse().unwrap());
    headers.insert("Sec-Fetch-Mode", "navigate".parse().unwrap());
    headers.insert("Sec-Fetch-User", "?1".parse().unwrap());
    headers.insert("Sec-Fetch-Dest", "document".parse().unwrap());
    headers.insert("Accept-Language", "zh-CN,zh;q=0.9".parse().unwrap());
    headers.insert("Accept-Encoding", "gzip, deflate, br, zstd".parse().unwrap());
    headers.insert("dnt", "1".parse().unwrap());
    headers
}

pub async fn query_melon_index(proxy: &str, timeout: u64) -> TestResult {
    let url = "https://tkglobal.melon.com/main/index.htm?langCd=EN";
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
    println!("{:?}", status);
    match status {
        StatusCode::OK => TestResult {
            status: "OK".to_string(),
            delay: Some(start.elapsed().unwrap().as_millis() as u64),
        },
        StatusCode::FORBIDDEN | StatusCode::NOT_ACCEPTABLE => TestResult {
            status: "BAN".to_string(),
            delay: None,
        },
        _ => TestResult {
            status: "TIMEOUT".to_string(),
            delay: None,
        },
    }
}

pub async fn query_melon_payment(proxy: &str, timeout: u64) -> TestResult {
    let url = "https://3ds-pub-coe.netcetera-payment.ch";
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
    println!("{:?}", status);
    TestResult {
        status: "OK".to_string(),
        delay: Some(start.elapsed().unwrap().as_millis() as u64),
    }
}


#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_query_melon_index_banned() {
        let proxy = "109.110.176.106:50100:9OXsGWWT:DYXCB3XX";
        let split: Vec<&str> = proxy.split(':').collect();
        let proxy = format!("http://{}:{}@{}:{}", split[2], split[3], split[0], split[1]);
        let timeout = 30;
        let res = query_melon_index(&proxy, timeout).await;
        println!("{:?}", res);
    }

    #[tokio::test]
    async fn test_query_melon_index_local() {
        let proxy = "localhost:9090";
        let split: Vec<&str> = proxy.split(':').collect();
        let proxy = format!("http://{}:{}", split[0], split[1]);
        let timeout = 30;
        let res = query_melon_index(&proxy, timeout).await;
        println!("{:?}", res);
    }
}


