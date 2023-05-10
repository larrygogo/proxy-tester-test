// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::{Duration, SystemTime};

use reqwest::Client;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod nike;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn test_nike(
    proxy: String,
    username: String,
    password: String,
    socks5: bool,
    timeout: Option<u64>,
) -> String {
    let proxy_str = if socks5 {
        format!("socks5h://{username}:{password}@{proxy}")
    } else {
        format!("http://{username}:{password}@{proxy}")
    };
    let timeout = timeout.unwrap_or(30);
    nike::query_nike_web(proxy_str.as_str(), timeout).await
}

#[tauri::command]
async fn test_proxy(
    proxy: String,
    username: String,
    password: String,
    addr: String,
    socks5: bool,
    timeout: Option<u64>,
) -> String {
    println!("receive data {proxy} {username} {password} {addr}");
    let proxy_str = if socks5 {
        format!("socks5h://{username}:{password}@{proxy}")
    } else {
        format!("http://{username}:{password}@{proxy}")
    };
    let proxy = reqwest::Proxy::all(proxy_str.as_str()).unwrap();
    let timeout = timeout.unwrap_or(30);
    let client = Client::builder()
        .trust_dns(true)
        .proxy(proxy)
        .timeout(Duration::from_secs(timeout))
        .build()
        .unwrap();

    let command = client.get(addr.as_str());
    let start = SystemTime::now();
    println!("{:?}", start);
    let res = command.send().await;
    match res {
        Ok(_) => format!("{}ms", start.elapsed().unwrap().as_millis()),
        Err(_) => "fail".to_string(),
    }
}

fn main() {
    env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, test_proxy, test_nike])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

mod test {
    #[tokio::test]
    async fn test_run_proxy_test() {
        use super::test_proxy;
        env_logger::init();

        let res = test_proxy(
            "192.168.0.111:7000".to_string(),
            "customer-VJF5fRktTKjy8_22585-cc-BZ-session-905370".to_string(),
            "spXw78Zs0coKv".to_string(),
            "https://www.google.com/".to_string(),
            false,
            None,
        )
        .await;
        println!("{:?}", res);
    }

    #[tokio::test]
    async fn test_run_test_nike() {
        use super::test_nike;
        let res = test_nike(
            "192.168.0.111:7000".to_string(),
            "customer-VJF5fRktTKjy8_22585-cc-BZ-session-905370".to_string(),
            "spXw78Zs0coKv".to_string(),
            false,
            None,
        )
        .await;

        println!("{:?}", res);
    }
}
