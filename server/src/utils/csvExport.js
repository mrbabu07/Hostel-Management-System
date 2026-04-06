const { Parser } = require("json2csv");
const { logger } = require("./logger");

class CSVExport {
  /**
   * Export users to CSV
   */
  static exportUsers(users) {
    try {
      const fields = ["_id", "name", "email", "role", "rollNumber", "roomNumber", "phone", "isActive", "createdAt"];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(users);
      logger.info({ count: users.length }, "Users exported to CSV");
      return csv;
    } catch (error) {
      logger.error({ error: error.message }, "Failed to export users to CSV");
      throw error;
    }
  }

  /**
   * Export attendance records to CSV
   */
  static exportAttendance(records) {
    try {
      const fields = ["_id", "student", "mealType", "date", "status", "createdAt"];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(records);
      logger.info({ count: records.length }, "Attendance exported to CSV");
      return csv;
    } catch (error) {
      logger.error({ error: error.message }, "Failed to export attendance to CSV");
      throw error;
    }
  }

  /**
   * Export billing records to CSV
   */
  static exportBilling(bills) {
    try {
      const fields = ["_id", "student", "month", "totalAmount", "status", "paidDate", "createdAt"];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(bills);
      logger.info({ count: bills.length }, "Billing exported to CSV");
      return csv;
    } catch (error) {
      logger.error({ error: error.message }, "Failed to export billing to CSV");
      throw error;
    }
  }

  /**
   * Export complaints to CSV
   */
  static exportComplaints(complaints) {
    try {
      const fields = ["_id", "student", "category", "title", "description", "status", "priority", "createdAt"];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(complaints);
      logger.info({ count: complaints.length }, "Complaints exported to CSV");
      return csv;
    } catch (error) {
      logger.error({ error: error.message }, "Failed to export complaints to CSV");
      throw error;
    }
  }

  /**
   * Export notices to CSV
   */
  static exportNotices(notices) {
    try {
      const fields = ["_id", "title", "content", "targetAudience", "isPinned", "createdAt"];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(notices);
      logger.info({ count: notices.length }, "Notices exported to CSV");
      return csv;
    } catch (error) {
      logger.error({ error: error.message }, "Failed to export notices to CSV");
      throw error;
    }
  }

  /**
   * Export feedback to CSV
   */
  static exportFeedback(feedbacks) {
    try {
      const fields = ["_id", "student", "mealType", "rating", "comment", "createdAt"];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(feedbacks);
      logger.info({ count: feedbacks.length }, "Feedback exported to CSV");
      return csv;
    } catch (error) {
      logger.error({ error: error.message }, "Failed to export feedback to CSV");
      throw error;
    }
  }

  /**
   * Export inventory to CSV
   */
  static exportInventory(items) {
    try {
      const fields = ["_id", "itemName", "quantity", "unit", "category", "lastUpdated"];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(items);
      logger.info({ count: items.length }, "Inventory exported to CSV");
      return csv;
    } catch (error) {
      logger.error({ error: error.message }, "Failed to export inventory to CSV");
      throw error;
    }
  }

  /**
   * Generic export function
   */
  static exportData(data, fields) {
    try {
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(data);
      logger.info({ count: data.length, fields }, "Data exported to CSV");
      return csv;
    } catch (error) {
      logger.error({ error: error.message }, "Failed to export data to CSV");
      throw error;
    }
  }
}

module.exports = CSVExport;
