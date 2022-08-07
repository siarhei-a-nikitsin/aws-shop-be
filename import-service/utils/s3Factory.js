import { S3 } from "aws-sdk";

const REGION = "eu-west-1"; // TODO: move to enviroment variables

const getS3 = () => new S3({ region: REGION });

export { getS3 };
