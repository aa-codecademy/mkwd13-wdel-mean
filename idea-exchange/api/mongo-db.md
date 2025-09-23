# Getting Started with MongoDB

## 1. Create an Account and Free Cluster
- Sign up with Google, GitHub or email
- Accept the default Organization and Project names or set your own
- Create a `Cluster`
- Click Build a Database - choose the `Free (M0) plan`
- Confirm with `Create`

## 2. Create a Database User
- Go to Security → Database Access → Add New Database User
- Choose Password as the authentication method
- Enter a username and strong password
- Click `Add User`

## 3. Allow IP Access
- Go to `Security` → `Network Access` → `Add IP Address`
- Click `Add Current IP Address`
- For testing, you can use `0.0.0.0/0` (allows all IPs) - but never use in production!
- Save

## 4. Get the Connection String
- Open your cluster and click `Connect`
- Choose `Drivers`
- Copy the connection string (it starts with mongodb+srv://)
- Save it in your `.env` file like: 
`MONGO_URI="mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER-HOST>/<DBNAME>?retryWrites=true&w=majority&appName=RandomCluster"`
- Replace `<USERNAME>, <PASSWORD>, <CLUSTER-HOST>`, and `<DBNAME>` with your own values.

## 5. Celebrate! 🎉
- You've successfully set up MongoDB Atlas! 🚀