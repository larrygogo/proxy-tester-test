// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::{Duration, SystemTime};

use reqwest::Client;
use serde::{Deserialize, Serialize};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod nike;
mod global_interpark;
mod utils;
mod global_melon;

#[derive(Debug, Serialize, Deserialize)]
pub struct TestResult {
    pub status: String,
    pub delay: Option<u64>,
}

#[tauri::command]
async fn test_nike(
    proxy: String,
    username: Option<String>,
    password: Option<String>,
    socks5: bool,
    timeout: Option<u64>,
) -> TestResult {
    println!("{proxy} {:?} {:?}", username, password);
    let proxy_str = get_proxy_url(proxy, username, password, socks5);
    let timeout = timeout.unwrap_or(30);
    nike::query_nike_web(proxy_str.as_str(), timeout).await
}

#[tauri::command]
async fn test_interpark_global_queue(
    proxy: String,
    username: Option<String>,
    password: Option<String>,
    socks5: bool,
    timeout: Option<u64>,
    sku: String,
) -> TestResult {
    println!("test_interpark_global_queue:{proxy} {:?} {:?} {:?}", username, password, sku);
    let proxy_str = get_proxy_url(proxy, username, password, socks5);
    let timeout = timeout.unwrap_or(30);
    global_interpark::to_create_session(&sku, proxy_str.as_str(), timeout).await
}

#[tauri::command]
async fn test_interpark_global_index(
    proxy: String,
    username: Option<String>,
    password: Option<String>,
    socks5: bool,
    timeout: Option<u64>,
) -> TestResult {
    println!("{proxy} {:?} {:?}", username, password);
    let proxy_str = get_proxy_url(proxy, username, password, socks5);
    let timeout = timeout.unwrap_or(30);
    global_interpark::query_itp_index(proxy_str.as_str(), timeout).await
}

#[tauri::command]
async fn test_melon_global_index(
    proxy: String,
    username: Option<String>,
    password: Option<String>,
    socks5: bool,
    timeout: Option<u64>,
) -> TestResult {
    println!("melon global {proxy} {:?} {:?}", username, password);
    let proxy_str = get_proxy_url(proxy, username, password, socks5);
    let timeout = timeout.unwrap_or(30);
    global_melon::query_melon_index(proxy_str.as_str(), timeout).await
}

#[tauri::command]
async fn test_melon_global_payment(
    proxy: String,
    username: Option<String>,
    password: Option<String>,
    socks5: bool,
    timeout: Option<u64>,
) -> TestResult {
    println!("melon global payment {proxy} {:?} {:?}", username, password);
    let proxy_str = get_proxy_url(proxy, username, password, socks5);
    let timeout = timeout.unwrap_or(5);
    global_melon::query_melon_payment(proxy_str.as_str(), timeout).await
}

#[tauri::command]
async fn test_proxy(
    proxy: String,
    username: Option<String>,
    password: Option<String>,
    addr: String,
    socks5: bool,
    timeout: Option<u64>,
) -> TestResult {
    let proxy_str = get_proxy_url(proxy, username, password, socks5);
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
        Ok(_) => TestResult {
            status: "OK".to_string(),
            delay: Some(start.elapsed().unwrap().as_millis() as u64),
        },
        Err(_) => TestResult {
            status: "fail".to_string(),
            delay: None,
        },
    }
}


fn main() {
    env_logger::init();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            test_proxy,
            test_interpark_global_index,
            test_interpark_global_queue,
            test_nike,
            test_melon_global_index,
            test_melon_global_payment,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn get_proxy_url(
    proxy: String,
    username: Option<String>,
    password: Option<String>,
    socks: bool,
) -> String {
    match (username, password) {
        (Some(username), Some(password)) => format!(
            "{header}://{username}:{password}@{proxy}",
            username = username,
            password = password,
            proxy = proxy,
            header = if socks { "socks5h" } else { "http" }
        ),
        _ => format!(
            "{header}://{proxy}",
            proxy = proxy,
            header = if socks { "socks5h" } else { "http" }
        ),
    }
}


mod test {
    #[tokio::test]
    async fn test_run_proxy_test() {
        use super::test_proxy;
        env_logger::init();

        let res = test_proxy(
            "192.168.0.111:7000".to_string(),
            Some("customer-VJF5fRktTKjy8_22585-cc-BZ-session-905370".to_string()),
            Some("spXw78Zs0coKv".to_string()),
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
            Some("customer-VJF5fRktTKjy8_22585-cc-BZ-session-905370".to_string()),
            Some("spXw78Zs0coKv".to_string()),
            false,
            None,
        )
            .await;
        println!("{:?}", res);
    }

    #[tokio::test]
    async fn test_run_test_nike1() {
        use super::test_nike;
        let res = test_nike("192.168.0.111:7000".to_string(), None, None, false, None).await;
        println!("{:?}", res);
    }
}

