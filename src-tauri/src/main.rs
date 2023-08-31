// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::{Duration, SystemTime};

use reqwest::Client;
use serde::{Deserialize, Serialize};
use tauri::Manager;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

mod nike;
mod setup;

#[derive(Debug, Serialize, Deserialize)]
pub struct TestResult {
    pub status: String,
    pub delay: Option<u64>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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

#[tauri::command]
fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}

fn main() {
    env_logger::init();

    tauri::Builder::default()
        //titleBarStyle
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet, test_proxy, test_nike, close_splashscreen])
        .setup(setup::init)
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

