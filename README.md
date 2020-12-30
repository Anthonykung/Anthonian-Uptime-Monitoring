# Anthonian Uptime Monitoring

A simple uptime monitoring system to check your web applications and keep your Repl.it projects alive.

## Status

![Status: Fully Operational](https://img.shields.io/static/v1?label=Status&message=Operational&color=green)

## Prerequisite & Support

**Repl.it Database** - This project currently only support the Repl.it Database

### Setup Mail Clients - Add your SMTP mail account to the Repl.it Database

In `mailer.js` add your own SMTP mail account by uncomment this block and replace the values. Runs the program and remove the block from `mailer.js` immidiately after.

```js
await db.set("mailAddr", "{{ REPLACE THIS }}").catch(console.error);
await db.set("mailUser", "{{ REPLACE THIS }}").catch(console.error);
await db.set("mailPass", "{{ REPLACE THIS }}").catch(console.error);
await db.set("mailHost", "{{ REPLACE THIS }}").catch(console.error);
await db.set("mailPort", "{{ REPLACE THIS }}").catch(console.error);
```

Make sure to check the security settings at `line 21` as below:

```js
  secure: false, // true for 465, false for other ports
```

### HTML Pages & Email Templates

Be sure to replace the HTML pages and Emails with your own.

**HTML Pages** - `private/`

**Email Templates** - `themes/default/emails/`

## Usage

1. Visit the project at [https://uptime.anth.dev](https://uptime.anth.dev)

2. Run the project in production mode

```
NODE_ENV=production node index.js
```

3. Or click the run button on Repl.it

## Future Development

- Support of MongoDB may be available in the future
- Templatize pages and emails for better customization

## License

Apache 2.0 LICENSE

Anthonian Uptime Monitoring - A simple uptime monitoring system to check your web applications and keep your Repl.it projects alive.

Copyright 2020 Anthony Kung

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

```
   http://www.apache.org/licenses/LICENSE-2.0
```

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.