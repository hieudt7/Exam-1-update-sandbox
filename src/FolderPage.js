import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card } from "antd";
import { Link } from "react-router-dom";
import getFolders from "./getFolders";
import { FolderOutlined } from "@ant-design/icons";
const FolderPage = () => {
  const [state, setState] = useState({});
  const [treeView, setTreeView] = useState({});
  useEffect(() => {
    getFolders().then(setState);
  }, []);

  useEffect(() => {
    let obj = JSON.parse(JSON.stringify(state));
    if (obj.children) {
      obj.children.forEach((item) => {
        item["path"] = item.name + "/";
        if (item.children && item.children.length > 0) {
          generatePath(item.children, item.path);
        }
      });
    }
    setTreeView(obj);
  }, [state]);
  const generatePath = (element, parent) => {
    if (element) {
      element.forEach((el) => {
        el["path"] = parent + el.name + "/";
        if (el.children) {
          generatePath(el.children, parent + el.name + "/");
        }
      });
    }
  };
  const data = treeView;
  const Tree = ({ data }) => (
    <ul>
      {data &&
        data.map((item, idx) => (
          <li className="tree-parent" key={idx} id={`tree_${item.id}`}>
            <Card>
              <Link to={`/folder/${item.id}`} className="tree-link">
                <FolderOutlined />
                {item.name}
              </Link>
              <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>{state.name}</Breadcrumb.Item>
                {item.path &&
                  item.path
                    .split("/")
                    .map((item, idx) => (
                      <Breadcrumb.Item>{item}</Breadcrumb.Item>
                    ))}
              </Breadcrumb>
            </Card>
            {item.children && <Tree data={item.children} parent={item} />}
          </li>
        ))}
    </ul>
  );
  return (
    <div>
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{state.name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div>
        <List
          className="folder-tree"
          grid={{ gutter: 10, column: 4 }}
          dataSource={data.children}
          renderItem={(item, index) => (
            <ul>
              <li className="first-tree" key={index}>
                <Card>
                  <Link to={`/folder/${item.id}`}>
                    <FolderOutlined />
                    {item.name}
                  </Link>
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <Link to="/">Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{state.name}</Breadcrumb.Item>
                    <Breadcrumb.Item>{item.name}</Breadcrumb.Item>
                  </Breadcrumb>
                </Card>
                {item.children && <Tree data={item.children} />}
              </li>
            </ul>
          )}
        />
      </div>
    </div>
  );
};

export default FolderPage;
