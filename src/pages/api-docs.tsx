import dynamic from 'next/dynamic';
import swaggerDocument from "../beetswars-api.json";
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(
  () => import('swagger-ui-react'), { ssr: false }
);

export default function ApiDocs() {
  return <SwaggerUI spec={swaggerDocument} />;
}