import { SNS } from "aws-sdk";

export const sendNewProductsNotification = async (newProducts) => {
  const sns = new SNS({ region: process.env.REGION });

  const expensiveNewProducts = [];
  const nonExpensiveNewProducts = [];

  newProducts.forEach((product) => {
    if (product.price >= 100) {
      expensiveNewProducts.push(product);
    } else {
      nonExpensiveNewProducts.push(product);
    }
  });

  const sendNotification = async (products, isExpensiveProducts) => {
    try {
      const result = await sns
        .publish({
          Subject: `New ${
            isExpensiveProducts ? "expensive" : ""
          } products are created!`,
          Message: JSON.stringify(products),
          TopicArn: process.env.SNS_ARN,
          MessageAttributes: {
            IsExpensive: {
              DataType: "String",
              StringValue: isExpensiveProducts.toString(),
            },
          },
        })
        .promise();

      console.log("Send notification for ", products, " with result ", result);
    } catch (error) {
      console.log("Send notification for ", products, "with error ", error);
    }
  };

  expensiveNewProducts.length > 0 &&
    (await sendNotification(expensiveNewProducts, true));
  nonExpensiveNewProducts.length > 0 &&
    (await sendNotification(nonExpensiveNewProducts, false));
};
