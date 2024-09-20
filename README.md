# Tweeter Auto Posting Bot

A lightweight Chrome extension for automated tweeting without the need for the Twitter API, designed to emulate normal user behavior to avoid bot detection.

## About

The Tweeter Auto Posting Bot eliminates the need for costly Twitter API plans (up to $5000/month). Instead, it utilizes a browser-based approach to emulate user interactions, making it a cost-effective solution for automated tweeting.

## Features

- 🔥 **Random Time Gaps**: Posts are made with a random delay (1 to 20 seconds) between them to minimize the risk of detection as a bot.
- 🔥 **Quota Tracking**: The bot tracks Twitter's posting quotas (300 tweets every 3 hours and a maximum of 2400 tweets per day) and automatically pauses after every 3-hour cycle.
- 🔥 **Content Management**: Save a list of text; the bot will post each line sequentially.
- 🔥 **Content Variation**: To avoid posting identical content, the bot adds random characters (e.g., 🙂 👍 ⚡ ✅) to the posts without changing their meaning.
- 🔥 **Detailed Logging**: Provides log messages to show the current activity of the bot.

## How to Use

For a detailed walkthrough, check out the tutorial on [YouTube](https://www.youtube.com/watch?v=vtlPIDOQylk).

## Notes

- ✔️ **Cross-Platform**: Works on any operating system since the extensions are platform-independent.
- ✔️ **Lightweight**: The zip file size is only 110 KB.

## Not To Do

- 🚫 **Avoid Empty Lines**: Do NOT keep unnecessary empty lines in the content collection. The bot will still function, but it's not recommended.
- 🚫 **Character Limit**: Do NOT write more than 279 characters in any line, as this restriction is set by Twitter.

---

Feel free to contribute and help improve the bot!
