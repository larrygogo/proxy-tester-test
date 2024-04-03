use std::collections::HashMap;
use rand::Rng;

pub fn cur_mils() -> i64 {
    chrono::Local::now().timestamp_millis()
}

pub fn randint(min: usize, max: usize) -> usize {
    if min == max {
        return min;
    }
    let mut rng = rand::thread_rng(); // 创建随机数生成器
    // 使用随机数生成器选择一个随机索引
    rng.gen_range(min..max)
}

pub fn cookie_obj_to_str(cookie_obj: &HashMap<String, String>) -> String {
    let mut cookie_str = String::from("");
    for (key, value) in cookie_obj {
        cookie_str.push_str(&format!("{}={};", key, value));
    }
    match cookie_str.is_empty() {
        true => String::from(""),
        false => cookie_str[0..cookie_str.len() - 1].to_string(),
    }
}
