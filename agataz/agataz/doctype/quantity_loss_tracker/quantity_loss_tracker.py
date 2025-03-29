# Copyright (c) 2025, 	 and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
frappe.utils.logger.set_log_level("DEBUG")
logger = frappe.logger("3cx_api", allow_site=True, file_count=50)

class QuantityLossTracker(Document):
	pass


@frappe.whitelist()
def add_sales_order_item(sales_order):
    sales_order = frappe.get_doc("Sales Order", sales_order)

    new_rows = []

    for order in sales_order.items:
        if order.item_code:
            new_rows.append({
                "item_code": order.item_code,
                "qty": order.qty
            })

    return new_rows