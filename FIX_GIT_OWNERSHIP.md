# Fix Git Ownership Issue

## The Problem

Git is showing this error:
```
fatal: detected dubious ownership in repository
```

This happens when the repository was created by a different user or copied from another location.

---

## The Solution

Run this command in PowerShell:

```powershell
git config --global --add safe.directory 'E:/programming hero/Hostel-Management'
```

---

## After Running the Command

You can now use Git normally:

```bash
# Check status
git status

# Add files
git add server/src/controllers/payment.controller.js

# Commit
git commit -m "Add payment controller"

# Push
git push origin main
```

---

## Alternative: Fix for All Repositories

If you want to trust all repositories:

```bash
git config --global --add safe.directory '*'
```

⚠️ Warning: This is less secure but more convenient.

---

That's it! After running the command, Git will work normally.
