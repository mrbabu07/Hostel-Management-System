const { Parser } = require("json2csv");
const { formatDate } = require("./formatters");

class CSVGenerator {
  /**
   * Generate attendance CSV
   */
  static generateAttendanceCSV(data) {
    const fields = [
      { label: "Date", value: (row) => formatDate(row.date) },
      { label: "Student Name", value: "userId.name" },
      { label: "Roll Number", value: "userId.rollNumber" },
      { label: "Room Number", value: "userId.roomNumber" },
      { label: "Meal Type", value: "mealType" },
      { label: "Present", value: (row) => (row.present ? "Yes" : "No") },
      { label: "Marked By", value: "markedBy.name" },
      { label: "Marked At", value: (row) => formatDate(row.createdAt) },
    ];

    const parser = new Parser({ fields });
    return parser.parse(data);
  }

  /**
   * Generate billing CSV
   */
  static generateBillingCSV(bills) {
    const fields = [
      { label: "Bill ID", value: "_id" },
      { label: "Student Name", value: "userId.name" },
      { label: "Roll Number", value: "userId.rollNumber" },
      { label: "Month", value: "month" },
      { label: "Year", value: "year" },
      { label: "Breakfast Count", value: "breakfastCount" },
      { label: "Breakfast Amount", value: "breakfastAmount" },
      { label: "Lunch Count", value: "lunchCount" },
      { label: "Lunch Amount", value: "lunchAmount" },
      { label: "Dinner Count", value: "dinnerCount" },
      { label: "Dinner Amount", value: "dinnerAmount" },
      { label: "Total Amount", value: "totalAmount" },
      { label: "Status", value: (row) => (row.isPaid ? "PAID" : "DUE") },
      { label: "Generated At", value: (row) => formatDate(row.createdAt) },
    ];

    const parser = new Parser({ fields });
    return parser.parse(bills);
  }

  /**
   * Generate feedback CSV
   */
  static generateFeedbackCSV(feedback) {
    const fields = [
      { label: "Date", value: (row) => formatDate(row.date) },
      { label: "Student Name", value: "userId.name" },
      { label: "Roll Number", value: "userId.rollNumber" },
      { label: "Meal Type", value: "mealType" },
      { label: "Rating", value: "rating" },
      { label: "Comment", value: "comment" },
      { label: "Submitted At", value: (row) => formatDate(row.createdAt) },
    ];

    const parser = new Parser({ fields });
    return parser.parse(feedback);
  }

  /**
   * Generate complaints CSV
   */
  static generateComplaintsCSV(complaints) {
    const fields = [
      { label: "ID", value: "_id" },
      { label: "Student Name", value: "userId.name" },
      { label: "Roll Number", value: "userId.rollNumber" },
      { label: "Title", value: "title" },
      { label: "Category", value: "category" },
      { label: "Status", value: "status" },
      { label: "Priority", value: "priority" },
      { label: "Description", value: "description" },
      { label: "Admin Note", value: "adminNote" },
      { label: "Created At", value: (row) => formatDate(row.createdAt) },
      { label: "Updated At", value: (row) => formatDate(row.updatedAt) },
    ];

    const parser = new Parser({ fields });
    return parser.parse(complaints);
  }

  /**
   * Generate audit logs CSV
   */
  static generateAuditLogsCSV(logs) {
    const fields = [
      { label: "Timestamp", value: (row) => formatDate(row.createdAt) },
      { label: "Actor", value: "actorId.name" },
      { label: "Actor Role", value: "actorRole" },
      { label: "Action", value: "action" },
      { label: "Entity Type", value: "entityType" },
      { label: "Entity ID", value: "entityId" },
      { label: "Description", value: "description" },
      { label: "IP Address", value: "ipAddress" },
    ];

    const parser = new Parser({ fields });
    return parser.parse(logs);
  }

  /**
   * Generate users CSV
   */
  static generateUsersCSV(users) {
    const fields = [
      { label: "Name", value: "name" },
      { label: "Email", value: "email" },
      { label: "Role", value: "role" },
      { label: "Roll Number", value: "rollNumber" },
      { label: "Room Number", value: "roomNumber" },
      { label: "Phone", value: "phone" },
      { label: "Active", value: (row) => (row.isActive ? "Yes" : "No") },
      { label: "Created At", value: (row) => formatDate(row.createdAt) },
    ];

    const parser = new Parser({ fields });
    return parser.parse(users);
  }
}

module.exports = CSVGenerator;
