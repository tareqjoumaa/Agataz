import frappe
frappe.utils.logger.set_log_level("DEBUG")
logger = frappe.logger("3cx_api", allow_site=True, file_count=50)

def on_update(doc, method):
    add_customer_name_to_vessels(doc)


def add_customer_name_to_vessels(doc):
    if doc.custom_customer_vessels:
        for row in doc.custom_customer_vessels:
            frappe.db.set_value(row.doctype, row.name, "customer", doc.name, update_modified=True)


@frappe.whitelist()
def add_customer(doc_name):       
    doc = frappe.get_doc('Customer', doc_name)
    add_customer_name_to_vessels(doc)
    doc.save()
    return doc.get("custom_customer_vessels", [])


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



@frappe.whitelist()
def gross_profit(sales_invoice):
    invoice_rows = []
    purchase_rows = []
    sales_invoice = frappe.get_doc("Sales Invoice", sales_invoice)
    if sales_invoice.custom_purchase_order_id:
        purchase_invoice = frappe.get_doc("Purchase Invoice", sales_invoice.custom_purchase_order_id)
        for p in purchase_invoice.items:
            if p.item_code:
                purchase_rows.append({
                    "item_name": p.item_name,
                    "qty": p.qty,
                    "rate": p.rate,
                    "amount": p.amount
            })

    for invoice in sales_invoice.items:
        if invoice.item_code:
            invoice_rows.append({
                "item_name": invoice.item_name,
                "qty": invoice.qty,
                "rate": invoice.rate,
                "amount": invoice.amount
        })

    return purchase_rows, invoice_rows



    # sales_order_name = frappe.db.get_value(
    #     "Sales Invoice Item", 
    #     {"parent": sales_invoice}, 
    #     "sales_order"
    # )
    # if sales_order_name:
    #     custom_vessel = frappe.db.get_value("Sales Order", sales_order_name, "custom_vessel")
