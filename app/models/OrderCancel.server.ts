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
    const dbResponse = await db.orders.findFirst({
      where: { orderId },
    })
    console.log("applicationNum", dbResponse?.applicationNumber)
    return dbResponse ? dbResponse?.applicationNumber : null
  }catch(error){
    console.error("Unable to get Application Reference Number")
  }
}
