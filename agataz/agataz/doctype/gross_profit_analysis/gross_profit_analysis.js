// Copyright (c) 2025, 	 and contributors
// For license information, please see license.txt

frappe.ui.form.on("Gross Profit Analysis", {
	refresh(frm) {

	},
    sales_invoice: function(frm) {
        if (!frm.doc.sales_invoice) {
            return;
        }
        frappe.call({
            method: "agataz.doc_event.agataz.gross_profit",
            args: {
                sales_invoice: frm.doc.sales_invoice
            },
            callback: function(response) {
                if (response.message) {
                    response.message[0].forEach(item => {
                        let row = frm.add_child("purchase_invoice_items");
                        row.item_name = item.item_name;
                        row.qty = item.qty;
                        row.rate = item.rate;
                        row.amount = item.amount;
                    });
                    response.message[1].forEach(item => {
                        let row = frm.add_child("sales_invoice_items");
                        row.item_name = item.item_name;
                        row.qty = item.qty;
                        row.rate = item.rate;
                        row.amount = item.amount;
                    });
                        frm.refresh_field("purchase_invoice_items");
                        frm.refresh_field("sales_invoice_items");
                        let total_invoice = 0;
                        let total_purchase = 0;

                        frm.doc.sales_invoice_items.forEach(item => {
                            total_invoice += item.amount || 0;
                        });
                        frm.doc.purchase_invoice_items.forEach(item => {
                            total_purchase += item.amount || 0;
                        });
                        frm.set_value("invoice_total", total_invoice);
                        frm.set_value("purchase_total", total_purchase);
                        let total_gross_profit = total_invoice - total_purchase;
                        frm.set_value("gross_profit", total_gross_profit);
                    }
            }
        });
    }
});
