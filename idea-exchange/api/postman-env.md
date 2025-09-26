# Working with Postman Environments

## 1. Why Use Environments?
- In Postman we often work with different **environments**, for example:
  - **Development** (`http://localhost:3000/api`)
  - **Production** (`https://idea-exchange.com`)
- If we had to manually change the URL in every request, it would be a lot of work.
- That’s why Postman provides **Environment variables** that can be reused in requests.

## 2. Create a New Environment
- In the top-right corner of Postman, click on the **Environment Selector** (usually shows `No Environment`).
- Click on the **+ (Create Environment)** button.
- Give your environment a name (e.g., `DEV` or `PROD`).
- Add a variable:
  - **Key**: `url`
  - **Value**: `http://localhost:3000/api` (or your production URL)

## 3. Use Environment Variables in Requests
- Instead of writing the full address in every request, use double curly braces: `{{url}}/auth/register`
- Postman will automatically replace `{{url}}` with the value from the selected environment.

## 4. Switch Between Environments
- With one click in the **Environment Selector**, you can switch from Development to Production.
- This way, you don’t have to manually update all request URLs.

## 5. Done! 🎉
- You now have reusable environments in Postman, making your testing faster, safer, and more convenient.