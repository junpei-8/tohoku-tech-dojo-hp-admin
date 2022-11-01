use pulldown_cmark::{html, Options, Parser};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn md2html(markdown: &str) -> String {
    let markdown_input = markdown;

    let mut options = Options::empty();

    options.insert(Options::ENABLE_STRIKETHROUGH);

    let parser = Parser::new_ext(markdown_input, options);

    let mut result = String::new();

    html::push_html(&mut result, parser);

    result
}
