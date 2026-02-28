const Settings = require("../models/Settings.model");
const AuditService = require("./audit.service");

class SettingsService {
  /**
   * Get system settings
   */
  static async getSettings() {
    const settings = await Settings.getSettings();
    return settings;
  }

  /**
   * Update system settings
   */
  static async updateSettings(updates, userId, userRole, ipAddress, userAgent) {
    const settings = await Settings.getSettings();
    const before = settings.toObject();

    // Update fields
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && key !== "_id") {
        settings[key] = updates[key];
      }
    });

    settings.updatedBy = userId;
    await settings.save();

    // Create audit log
    await AuditService.log({
      actorId: userId,
      actorRole: userRole,
      action: "SETTINGS_UPDATE",
      entityType: "Settings",
      entityId: settings._id,
      before,
      after: settings.toObject(),
      description: "System settings updated",
      ipAddress,
      userAgent,
    });

    return settings;
  }

  /**
   * Add holiday
   */
  static async addHoliday(date, reason, userId, userRole) {
    const settings = await Settings.getSettings();

    settings.holidays.push({ date: new Date(date), reason });
    settings.updatedBy = userId;
    await settings.save();

    await AuditService.log({
      actorId: userId,
      actorRole: userRole,
      action: "UPDATE",
      entityType: "Settings",
      entityId: settings._id,
      description: `Holiday added: ${reason} on ${date}`,
    });

    return settings;
  }

  /**
   * Remove holiday
   */
  static async removeHoliday(holidayId, userId, userRole) {
    const settings = await Settings.getSettings();

    settings.holidays = settings.holidays.filter(
      (h) => h._id.toString() !== holidayId,
    );
    settings.updatedBy = userId;
    await settings.save();

    await AuditService.log({
      actorId: userId,
      actorRole: userRole,
      action: "UPDATE",
      entityType: "Settings",
      entityId: settings._id,
      description: `Holiday removed`,
    });

    return settings;
  }

  /**
   * Check if a date is a holiday
   */
  static async isHoliday(date) {
    const settings = await Settings.getSettings();
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return settings.holidays.some((holiday) => {
      const holidayDate = new Date(holiday.date);
      holidayDate.setHours(0, 0, 0, 0);
      return holidayDate.getTime() === checkDate.getTime();
    });
  }

  /**
   * Check if meal confirmation is allowed for a date
   */
  static async canConfirmMeal(mealDate) {
    const settings = await Settings.getSettings();
    const now = new Date();
    const targetDate = new Date(mealDate);

    // Check if it's a holiday
    if (await this.isHoliday(mealDate)) {
      return { allowed: false, reason: "Holiday - No meals available" };
    }

    // Check cutoff time
    const cutoffDays = settings.cutoffDaysBefore;
    const cutoffDateTime = new Date(targetDate);
    cutoffDateTime.setDate(cutoffDateTime.getDate() - cutoffDays);

    const [hours, minutes] = settings.cutoffTime.split(":");
    cutoffDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (now > cutoffDateTime) {
      return {
        allowed: false,
        reason: `Cutoff time passed. Must confirm ${cutoffDays} day(s) before by ${settings.cutoffTime}`,
      };
    }

    return { allowed: true };
  }
}

module.exports = SettingsService;
