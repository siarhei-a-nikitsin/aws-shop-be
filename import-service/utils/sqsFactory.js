import { SQS } from "aws-sdk";

const getSQS = () => new SQS();

export default { getSQS };
