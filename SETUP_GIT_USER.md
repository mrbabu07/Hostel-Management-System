# Setup Git User Configuration

## The Problem

Git doesn't know who you are and can't create commits.

---

## The Solution

Run these two commands with YOUR information:

```bash
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"
```

### Example:

```bash
git config --global user.email "jabed@example.com"
git config --global user.name "MD Jabed"
```

Or if you have a GitHub account:

```bash
git config --global user.email "your-github-email@example.com"
git config --global user.name "Your GitHub Username"
```

---

## After Configuration

Now you can commit:

```bash
git commit -m "Add payment controller"
```

---

## Verify Your Configuration

Check if it's set correctly:

```bash
git config --global user.name
git config --global user.email
```

---

## Complete Workflow

```bash
# 1. Configure Git (one time only)
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"

# 2. Add files
git add server/src/controllers/payment.controller.js

# 3. Commit
git commit -m "Add payment controller"

# 4. Push
git push origin main
```

---

That's it! After setting your name and email, Git will remember it for all future commits.
