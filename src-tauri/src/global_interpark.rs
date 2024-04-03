use std::collections::HashMap;
use std::time::Duration;
use rand::distributions::Alphanumeric;
use rand::Rng;
use reqwest::{Client, header, StatusCode};
use reqwest::header::HeaderMap;
use crate::{TestResult, utils};

pub const UID_SCRIPT: &str = r#"function wordsToBytes(t){for(var n=[],e=0;e<32*t.length;e+=8)n.push(t[e>>>5]>>>24-e%32&255);return n}function rotl(t,n){return t<<n|t>>>32-n}function endian(t){if(t.constructor==Number)return 16711935&rotl(t,8)|4278255360&rotl(t,24);for(var n=0;n<t.length;n++)t[n]=endian(t[n]);return t}function p(t,n,e,r,o,i,u){var c=t+(n&e|~n&r)+(o>>>0)+u;return(c<<i|c>>>32-i)+n}function v(t,n,e,r,o,i,u){var c=t+(n&r|e&~r)+(o>>>0)+u;return(c<<i|c>>>32-i)+n}function b(t,n,e,r,o,i,u){var c=t+(n^e^r)+(o>>>0)+u;return(c<<i|c>>>32-i)+n}function y(t,n,e,r,o,i,u){var c=t+(e^(n|~r))+(o>>>0)+u;return(c<<i|c>>>32-i)+n}function stringToBytes(t){t=unescape(encodeURIComponent(t));for(var e=[],n=0;n<t.length;n++)e.push(255&t.charCodeAt(n));return e}function bytesToWords(t){for(var e=[],n=0,a=0;n<t.length;n++,a+=8)e[a>>>5]|=t[n]<<24-a%32;return e}var u=function t(e,u){e.constructor==String?e=u&&"binary"===u.encoding?stringToBytes(e):stringToBytes(e):o(e)?e=Array.prototype.slice.call(e,0):Array.isArray(e)||e.constructor===Uint8Array||(e=e.toString());for(var c=bytesToWords(e),a=8*e.length,f=1732584193,s=-271733879,l=-1732584194,h=271733878,d=0;d<c.length;d++)c[d]=16711935&(c[d]<<8|c[d]>>>24)|4278255360&(c[d]<<24|c[d]>>>8);c[a>>>5]|=128<<a%32,c[14+(a+64>>>9<<4)]=a;for(d=0;d<c.length;d+=16){var g=f,w=s,m=l,x=h;f=p(f,s,l,h,c[d+0],7,-680876936),h=p(h,f,s,l,c[d+1],12,-389564586),l=p(l,h,f,s,c[d+2],17,606105819),s=p(s,l,h,f,c[d+3],22,-1044525330),f=p(f,s,l,h,c[d+4],7,-176418897),h=p(h,f,s,l,c[d+5],12,1200080426),l=p(l,h,f,s,c[d+6],17,-1473231341),s=p(s,l,h,f,c[d+7],22,-45705983),f=p(f,s,l,h,c[d+8],7,1770035416),h=p(h,f,s,l,c[d+9],12,-1958414417),l=p(l,h,f,s,c[d+10],17,-42063),s=p(s,l,h,f,c[d+11],22,-1990404162),f=p(f,s,l,h,c[d+12],7,1804603682),h=p(h,f,s,l,c[d+13],12,-40341101),l=p(l,h,f,s,c[d+14],17,-1502002290),f=v(f,s=p(s,l,h,f,c[d+15],22,1236535329),l,h,c[d+1],5,-165796510),h=v(h,f,s,l,c[d+6],9,-1069501632),l=v(l,h,f,s,c[d+11],14,643717713),s=v(s,l,h,f,c[d+0],20,-373897302),f=v(f,s,l,h,c[d+5],5,-701558691),h=v(h,f,s,l,c[d+10],9,38016083),l=v(l,h,f,s,c[d+15],14,-660478335),s=v(s,l,h,f,c[d+4],20,-405537848),f=v(f,s,l,h,c[d+9],5,568446438),h=v(h,f,s,l,c[d+14],9,-1019803690),l=v(l,h,f,s,c[d+3],14,-187363961),s=v(s,l,h,f,c[d+8],20,1163531501),f=v(f,s,l,h,c[d+13],5,-1444681467),h=v(h,f,s,l,c[d+2],9,-51403784),l=v(l,h,f,s,c[d+7],14,1735328473),f=b(f,s=v(s,l,h,f,c[d+12],20,-1926607734),l,h,c[d+5],4,-378558),h=b(h,f,s,l,c[d+8],11,-2022574463),l=b(l,h,f,s,c[d+11],16,1839030562),s=b(s,l,h,f,c[d+14],23,-35309556),f=b(f,s,l,h,c[d+1],4,-1530992060),h=b(h,f,s,l,c[d+4],11,1272893353),l=b(l,h,f,s,c[d+7],16,-155497632),s=b(s,l,h,f,c[d+10],23,-1094730640),f=b(f,s,l,h,c[d+13],4,681279174),h=b(h,f,s,l,c[d+0],11,-358537222),l=b(l,h,f,s,c[d+3],16,-722521979),s=b(s,l,h,f,c[d+6],23,76029189),f=b(f,s,l,h,c[d+9],4,-640364487),h=b(h,f,s,l,c[d+12],11,-421815835),l=b(l,h,f,s,c[d+15],16,530742520),f=y(f,s=b(s,l,h,f,c[d+2],23,-995338651),l,h,c[d+0],6,-198630844),h=y(h,f,s,l,c[d+7],10,1126891415),l=y(l,h,f,s,c[d+14],15,-1416354905),s=y(s,l,h,f,c[d+5],21,-57434055),f=y(f,s,l,h,c[d+12],6,1700485571),h=y(h,f,s,l,c[d+3],10,-1894986606),l=y(l,h,f,s,c[d+10],15,-1051523),s=y(s,l,h,f,c[d+1],21,-2054922799),f=y(f,s,l,h,c[d+8],6,1873313359),h=y(h,f,s,l,c[d+15],10,-30611744),l=y(l,h,f,s,c[d+6],15,-1560198380),s=y(s,l,h,f,c[d+13],21,1309151649),f=y(f,s,l,h,c[d+4],6,-145523070),h=y(h,f,s,l,c[d+11],10,-1120210379),l=y(l,h,f,s,c[d+2],15,718787259),s=y(s,l,h,f,c[d+9],21,-343485551),f=f+g>>>0,s=s+w>>>0,l=l+m>>>0,h=h+x>>>0}return endian([f,s,l,h])};function bytesToString(t){for(var n=[],e=0;e<t.length;e++)n.push(String.fromCharCode(t[e]));return n.join("")}function bytesToHex(t){for(var n=[],e=0;e<t.length;e++)n.push((t[e]>>>4).toString(16)),n.push((15&t[e]).toString(16));return n.join("")}function d_u(t,e){if(void 0===t||null===t)throw new Error("Illegal argument "+t);var r=wordsToBytes(u(t,e));return e&&e.asBytes?r:e&&e.asString?bytesToString(r):bytesToHex(r)}function _(e,t){e+="=";var n=t.indexOf(e),a="";if(-1!==n){n+=e.length;var r=t.indexOf(";",n);-1===r&&(r=t.length),a=t.substring(n,r)}return unescape(a)}function create_uid(u,product_id,cookie){var r=u+product_id+_('tempinterparkGUEST_global',cookie)+Math.random().toString(32).substring(2,15)+Math.random().toString(32).substring(2,15);return d_u(r)}"#;

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
    let uid = {
        let context = utils::load_script(UID_SCRIPT).unwrap();
        let js_value = context
            .eval(&format!(
                "create_uid('{}', '{}', '{}')",
                "g",
                product_id,
                utils::cookie_obj_to_str(&cookies)
            ))
            .unwrap();
        js_value.as_str().unwrap_or_default().to_string()
    };
    let create_url = format!(
        "https://api-ticketwaiting.interpark.com/v1/wyns/create/session/{}/{}?t={}",
        product_id, uid.as_str(), utils::cur_mils().to_string().as_str(),
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

