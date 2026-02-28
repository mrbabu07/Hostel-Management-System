# Git Commit Guide - 20+ Commits

## How to Commit Files One at a Time

Here's how to make multiple commits by adding files individually or in small groups:

---

## Step 1: Check What Files Changed

```bash
git status
```

This will show all modified, new, and deleted files.

---

## Step 2: Commit Files One by One

Use this pattern for each file or group of files:

```bash
# Add one file
git add <filename>

# Commit it
git commit -m "Your commit message"
```

---

## Example: 20+ Commits for Your Project

### Backend Commits:

```bash
# 1. Payment controller
git add server/src/controllers/payment.controller.js
git commit -m "Add Stripe payment controller with payment intent creation"

# 2. Billing controller
git add server/src/controllers/billing.controller.js
git commit -m "Update billing controller with fixed 6000 TK monthly rate"

# 3. Payment routes
git add server/src/routes/payment.routes.js
git commit -m "Add payment routes for Stripe integration"

# 4. Billing routes
git add server/src/routes/billing.routes.js
git commit -m "Add billing routes for bill management"

# 5. Attendance routes
git add server/src/routes/attendance.routes.js
git commit -m "Add attendance routes for self-marking and approval"

# 6. Bill model
git add server/src/models/Bill.model.js
git commit -m "Add Bill model with payment status tracking"

# 7. Attendance model
git add server/src/models/Attendance.model.js
git commit -m "Update Attendance model with approval fields"

# 8. Menu model
git add server/src/models/Menu.model.js
git commit -m "Add imageUrl field to Menu model"

# 9. Package.json
git add server/package.json
git commit -m "Add Stripe dependency to backend"
```

### Frontend Commits:

```bash
# 10. Stripe payment form
git add client/src/components/billing/StripePaymentForm.jsx
git commit -m "Add Stripe payment form component"

# 11. Bill view component
git add client/src/components/billing/BillView.jsx
git commit -m "Add bill view component"

# 12. Student dashboard
git add client/src/pages/student/ModernStudentDashboard.jsx
git commit -m "Update student dashboard with payment card and real data"

# 13. Student bills page
git add client/src/pages/student/ModernMyBill.jsx
git commit -m "Add student bills page with Stripe payment integration"

# 14. Self attendance page
git add client/src/pages/student/SelfAttendance.jsx
git commit -m "Add self-attendance marking page for students"

# 15. Admin billing page
git add client/src/pages/admin/BillingManage.jsx
git commit -m "Add admin billing management page"

# 16. Manager attendance approval
git add client/src/pages/manager/AttendanceApproval.jsx
git commit -m "Add manager attendance approval page"

# 17. Enhanced menu manage
git add client/src/pages/manager/EnhancedMenuManage.jsx
git commit -m "Add enhanced menu management with image upload"

# 18. Payment service
git add client/src/services/payment.service.js
git commit -m "Add payment service for Stripe API calls"

# 19. Billing service
git add client/src/services/billing.service.js
git commit -m "Add billing service for bill management"

# 20. Image service
git add client/src/services/image.service.js
git commit -m "Add image service for BigOven API integration"

# 21. Attendance service
git add client/src/services/attendance.service.js
git commit -m "Add attendance service with self-marking support"

# 22. App routes
git add client/src/routes/AppRoutes.jsx
git commit -m "Update routes with new pages"

# 23. Design system
git add client/src/styles/designSystem.js
git commit -m "Add design system with color palette and typography"

# 24. Package.json
git add client/package.json
git commit -m "Add Stripe and other dependencies to frontend"

# 25. Environment example
git add client/.env.example
git commit -m "Add environment variables example file"
```

---

## Step 3: Push All Commits

After making all commits:

```bash
git push origin main
```

Or if your branch is different:

```bash
git push origin <your-branch-name>
```

---

## Alternative: Commit by Feature

You can also group related files:

```bash
# Payment system
git add server/src/controllers/payment.controller.js server/src/routes/payment.routes.js
git commit -m "Add payment system backend"

git add client/src/components/billing/StripePaymentForm.jsx client/src/services/payment.service.js
git commit -m "Add payment system frontend"

# Billing system
git add server/src/controllers/billing.controller.js server/src/routes/billing.routes.js
git commit -m "Add billing system backend"

git add client/src/pages/admin/BillingManage.jsx client/src/services/billing.service.js
git commit -m "Add billing system frontend"

# And so on...
```

---

## Important Notes

### ⚠️ DO NOT Commit .env Files!

```bash
# Make sure .env files are in .gitignore
echo "*.env" >> .gitignore
echo "!.env.example" >> .gitignore

git add .gitignore
git commit -m "Update gitignore to exclude .env files"
```

Your `.env` files contain sensitive keys (Stripe, MongoDB) and should NEVER be committed!

---

## Quick Script to See All Changed Files

```bash
# See all changed files
git status --short

# See all changed files with full paths
git diff --name-only
```

---

## Tips

1. **Write clear commit messages**: Describe what the change does
2. **Commit related changes together**: Don't mix unrelated changes
3. **Test before committing**: Make sure your code works
4. **Don't commit secrets**: Never commit API keys, passwords, or .env files
5. **Use .gitignore**: Add files you don't want to track

---

## Example Workflow

```bash
# 1. See what changed
git status

# 2. Add one file
git add client/src/components/billing/StripePaymentForm.jsx

# 3. Commit it
git commit -m "Add Stripe payment form component"

# 4. Repeat for each file
# ...

# 5. Push all commits
git push origin main
```

---

That's it! You can make as many commits as you want by adding files one at a time! 🚀
