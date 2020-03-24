
import { Table} from "antd";

export default ({ params, columns, dataSource, loading, search }) => {
  
  return (
    <Table
      {...params}
      loading={loading}
      columns={columns}
      dataSource={dataSource.filter(item =>
        item["name"]
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      )}
    />
  );
};
