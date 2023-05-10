use reqwest::{header::HeaderMap, Client, StatusCode};
use std::time::Duration;

fn default_nike_headers() -> HeaderMap {
    let mut headers = HeaderMap::new();
    headers.insert("authority", "api.nike.com".parse().unwrap());
    headers.insert("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7".parse().unwrap());
    headers.insert(
        "accept-language",
        "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6,zh-TW;q=0.5"
            .parse()
            .unwrap(),
    );
    headers.insert(
        "sec-ch-ua",
        "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\""
            .parse()
            .unwrap(),
    );
    headers.insert("sec-ch-ua-mobile", "?0".parse().unwrap());
    headers.insert("sec-ch-ua-platform", "\"macOS\"".parse().unwrap());
    headers.insert("sec-fetch-dest", "document".parse().unwrap());
    headers.insert("sec-fetch-mode", "navigate".parse().unwrap());
    headers.insert("sec-fetch-site", "none".parse().unwrap());
    headers.insert("sec-fetch-user", "?1".parse().unwrap());
    headers.insert("upgrade-insecure-requests", "1".parse().unwrap());
    headers.insert("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36".parse().unwrap());
    headers
}

pub async fn query_nike_web(proxy: &str, timeout: u64) -> String {
    let url = "https://api.nike.com/product_feed/threads/v2?filter=marketplace(US)&filter=language(en)&filter=channelId(d9a5bc42-4b9c-4976-858a-f159cf99c647)&anchor=0&count=60&filter=productInfo.merchProduct.styleColor(FD2596-600)";
    let proxy = reqwest::Proxy::all(proxy).unwrap();
    let headers = default_nike_headers();
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
        return "request error".to_string();
    }
    let resp = t.unwrap();
    match resp.status() {
        StatusCode::OK => format!("{}ms", start.elapsed().unwrap().as_millis()),
        StatusCode::FORBIDDEN => "Banned".to_string(),
        _ => "Timeout".to_string(),
    }
}
