// Copyright (c) 2025, 	 and contributors
// For license information, please see license.txt

frappe.ui.form.on("Quantity Loss Tracker", {
    before_save: function (frm) {
        let total_loss = 0;
        frm.doc.items.forEach(item => {
            total_loss += item.quantity_loss || 0;
        });
        frm.set_value("total_quantity_loss", total_loss || 0);

    },
    sales_order: function(frm) {
        if (!frm.doc.sales_order) {
            return;
        }

        frappe.db.get_doc('Sales Order', frm.doc.sales_order).then(doc => {
            frm.set_value('vessel', doc.custom_vessel);
        });

        frappe.call({
            method: "agataz.doc_event.agataz.add_sales_order_item",
            args: {
                sales_order: frm.doc.sales_order
            },
            callback: function(response) {
                if (response.message) {
                    response.message.forEach(item => {
                        let row = frm.add_child("items");
                        row.item_code = item.item_code;
                        row.qty = item.qty;
                        });
                        frm.refresh_field("items");
                  }
            }
        });
    },
});


frappe.ui.form.on("Sales Order Items", {
    collected_quantity : function (frm, cdt, cdn) {
        let row = locals[cdt][cdn]; 
        quantity_loss = row.qty - row.collected_quantity
        frappe.model.set_value(cdt, cdn, "quantity_loss", quantity_loss);

    },
    quantity_loss : function (frm, cdt, cdn) {
        let row = locals[cdt][cdn]; 


    }
})
