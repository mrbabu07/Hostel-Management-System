const PDFDocument = require("pdfkit");
const { formatDate } = require("./formatters");

class PDFGenerator {
  /**
   * Generate bill PDF
   */
  static async generateBillPDF(bill, settings) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        // Header
        doc
          .fontSize(20)
          .text(settings.messName || "Hostel Mess", { align: "center" })
          .fontSize(10)
          .text(settings.messAddress || "", { align: "center" })
          .text(
            `Email: ${settings.contactEmail || "N/A"} | Phone: ${settings.contactPhone || "N/A"}`,
            {
              align: "center",
            },
          )
          .moveDown();

        // Title
        doc
          .fontSize(16)
          .text("MONTHLY BILL", { align: "center", underline: true })
          .moveDown();

        // Bill Details
        doc.fontSize(12);
        doc.text(`Bill ID: ${bill._id}`, 50, doc.y);
        doc.text(`Date: ${formatDate(bill.createdAt)}`, 350, doc.y - 15);
        doc.moveDown();

        // Student Details
        doc.text(`Student Name: ${bill.userId?.name || "N/A"}`);
        doc.text(`Roll Number: ${bill.userId?.rollNumber || "N/A"}`);
        doc.text(`Room Number: ${bill.userId?.roomNumber || "N/A"}`);
        doc.text(`Month: ${bill.month}/${bill.year}`);
        doc.moveDown();

        // Line separator
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Meal breakdown table
        const tableTop = doc.y;
        const col1 = 50;
        const col2 = 200;
        const col3 = 300;
        const col4 = 400;
        const col5 = 480;

        // Table header
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text("Meal Type", col1, tableTop)
          .text("Count", col2, tableTop)
          .text("Rate", col3, tableTop)
          .text("Amount", col4, tableTop);

        doc
          .moveTo(50, tableTop + 20)
          .lineTo(550, tableTop + 20)
          .stroke();

        // Table rows
        let y = tableTop + 30;
        doc.font("Helvetica");

        const meals = [
          {
            type: "Breakfast",
            count: bill.breakfastCount || 0,
            rate: settings.breakfastPrice || 0,
            amount: bill.breakfastAmount || 0,
          },
          {
            type: "Lunch",
            count: bill.lunchCount || 0,
            rate: settings.lunchPrice || 0,
            amount: bill.lunchAmount || 0,
          },
          {
            type: "Dinner",
            count: bill.dinnerCount || 0,
            rate: settings.dinnerPrice || 0,
            amount: bill.dinnerAmount || 0,
          },
        ];

        meals.forEach((meal) => {
          doc
            .text(meal.type, col1, y)
            .text(meal.count.toString(), col2, y)
            .text(`₹${meal.rate}`, col3, y)
            .text(`₹${meal.amount}`, col4, y);
          y += 25;
        });

        doc.moveTo(50, y).lineTo(550, y).stroke();
        y += 15;

        // Subtotal and charges
        doc.text("Subtotal:", col3, y);
        doc.text(`₹${bill.totalAmount || 0}`, col4, y);
        y += 20;

        if (settings.extraCharges > 0) {
          doc.text("Extra Charges:", col3, y);
          doc.text(`₹${settings.extraCharges}`, col4, y);
          y += 20;
        }

        if (settings.discountPercentage > 0) {
          const discount =
            (bill.totalAmount * settings.discountPercentage) / 100;
          doc.text(`Discount (${settings.discountPercentage}%):`, col3, y);
          doc.text(`-₹${discount.toFixed(2)}`, col4, y);
          y += 20;
        }

        if (settings.taxPercentage > 0) {
          const tax = (bill.totalAmount * settings.taxPercentage) / 100;
          doc.text(`Tax (${settings.taxPercentage}%):`, col3, y);
          doc.text(`₹${tax.toFixed(2)}`, col4, y);
          y += 20;
        }

        // Total
        doc.moveTo(50, y).lineTo(550, y).stroke();
        y += 15;

        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text("Total Amount:", col3, y)
          .text(`₹${bill.totalAmount}`, col4, y);

        // Status
        y += 30;
        doc.fontSize(11).font("Helvetica");
        doc.text(`Status: ${bill.isPaid ? "PAID" : "DUE"}`, col1, y);

        // Footer
        doc
          .fontSize(9)
          .text(
            "This is a computer-generated bill. No signature required.",
            50,
            doc.page.height - 100,
            { align: "center" },
          );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate attendance report PDF
   */
  static async generateAttendanceReportPDF(data, filters) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        // Header
        doc
          .fontSize(20)
          .text("Attendance Report", { align: "center" })
          .moveDown();

        // Filters
        doc.fontSize(11);
        if (filters.date) doc.text(`Date: ${formatDate(filters.date)}`);
        if (filters.mealType) doc.text(`Meal Type: ${filters.mealType}`);
        doc.moveDown();

        // Summary
        const present = data.filter((r) => r.present).length;
        const absent = data.length - present;
        const percentage =
          data.length > 0 ? ((present / data.length) * 100).toFixed(1) : 0;

        doc
          .fontSize(12)
          .text(`Total Students: ${data.length}`)
          .text(`Present: ${present}`)
          .text(`Absent: ${absent}`)
          .text(`Attendance: ${percentage}%`)
          .moveDown();

        // Table
        const tableTop = doc.y;
        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text("Student", 50, tableTop)
          .text("Roll No", 200, tableTop)
          .text("Meal", 300, tableTop)
          .text("Status", 400, tableTop);

        doc
          .moveTo(50, tableTop + 15)
          .lineTo(500, tableTop + 15)
          .stroke();

        let y = tableTop + 25;
        doc.font("Helvetica");

        data.forEach((record) => {
          if (y > 700) {
            doc.addPage();
            y = 50;
          }

          doc
            .text(record.userId?.name || "N/A", 50, y)
            .text(record.userId?.rollNumber || "N/A", 200, y)
            .text(record.mealType, 300, y)
            .text(record.present ? "Present" : "Absent", 400, y);
          y += 20;
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PDFGenerator;
