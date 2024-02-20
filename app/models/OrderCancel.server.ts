import db from "../db.server";

export async function handleOrderCancel(orderId: string, status: string) {
  try {
    const updatedOrder = await db.orders.update({
      where: { orderId },
      data: { cancelStatus: status },
    });
    return updatedOrder;
  } catch (error) {
    console.error("Order update failed", error);
  }
}
export async function getApplicationReferenceNumber(orderId: string){
  try{
    console.log("orderId", orderId)
    console.log("orderId type", typeof orderId)
    const order = await db.orders.findFirst({ where: { orderId } });
   
    console.log("order", order)
    return order ? order?.applicationNumber : null
  }catch(error){
    console.error("Unable to get Application Reference Number")
  }
}
