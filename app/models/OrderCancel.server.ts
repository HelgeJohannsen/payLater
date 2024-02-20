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
    const applicationNum = await db.orders.findUnique({
      where: {orderId},
      select: {
        applicationNumber: true
      }
    })
    console.log("applicationNum", applicationNum)
    return applicationNum
  }catch(error){
    console.error("Unable to get Application Reference Number")
  }
}
