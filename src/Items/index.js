import { useState, useEffect } from "react";
import { Table } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Title, Grid, Group, Space, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

function Items() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:9999/items")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePurchasedUpdate = async (item_id) => {
    try {
      await axios.put(`http://localhost:9999/items/${item_id}`, {
        purchased: true,
      });

      notifications.show({
        title: "List Purchased Update",
        color: "green",
      });

      const updatedPurchased = items.filter((i) => i._id !== item_id);
      setItems(updatedPurchased);
    } catch (error) {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    }
  };

  const handleUnpurchasedUpdate = async (item_id) => {
    try {
      await axios.put(`http://localhost:9999/items/${item_id}`, {
        purchased: false,
      });

      notifications.show({
        title: "List Purchased Update",
        color: "green",
      });

      const updatedPurchased = items.filter((i) => i._id !== item_id);
      setItems(updatedPurchased);
    } catch (error) {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    }
  };

  const filterPurchased = async (purchased = "") => {
    try {
      const response = await axios.get(
        "http://localhost:9999/items?purchased=" + purchased
      );
      setItems(response.data);
    } catch (error) {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    }
  };

  const filterPriority = async (priority = "") => {
    try {
      const response = await axios.get(
        "http://localhost:9999/items?priority=" + priority
      );
      setItems(response.data);
    } catch (error) {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    }
  };

  const handleItemDelete = async (item_id) => {
    try {
      // trigger API to delete from database
      await axios({
        method: "DELETE",
        url: "http://localhost:9999/items/" + item_id,
      });
      // method 1 (modify the state) - filter out the deleted movie
      notifications.show({
        title: "List Deleted",
        color: "green",
      });
      const newItems = items.filter((i) => i._id !== item_id);
      setItems(newItems);
    } catch (error) {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    }
  };

  return (
    <>
      <Space h="20px" />{" "}
      <Group position="center">
        <Button
          onClick={() => {
            filterPurchased("");
          }}
        >
          All
        </Button>
        <Button
          onClick={() => {
            filterPriority("Low");
          }}
        >
          Low
        </Button>
        <Button
          onClick={() => {
            filterPriority("Medium");
          }}
        >
          Medium
        </Button>
        <Button
          onClick={() => {
            filterPriority("High");
          }}
        >
          High
        </Button>

        <Button
          onClick={() => {
            filterPurchased("no");
          }}
        >
          Unpurchased
        </Button>
        <Button
          onClick={() => {
            filterPurchased("yes");
          }}
        >
          Purchased
        </Button>
      </Group>
      <Space h="35px" />
      <Group position="apart">
        <Title order={3} align="center">
          Item
        </Title>
        <Button
          color="yellow"
          onClick={() => {
            navigate("/item_add");
          }}
        >
          ADD
        </Button>
      </Group>
      <Space h="20px" />
      <Grid>
        {items ? (
          items.map((item) => {
            return (
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Priority</th>
                    <th>Purchased</th>
                    <th>
                      <Group position="right">Actions</Group>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>{item.priority}</td>
                    <td>
                      {item.purchased === true ? (
                        <Button
                          variant="gradient"
                          gradient={{ from: "blue", to: "gray" }}
                          size="xs"
                          radius="50px"
                          onClick={() => {
                            handleUnpurchasedUpdate(item._id);
                          }}
                        >
                          Unpurchased
                        </Button>
                      ) : (
                        <Button
                          variant="gradient"
                          gradient={{ from: "yellow", to: "pink" }}
                          size="xs"
                          radius="50px"
                          onClick={() => {
                            handlePurchasedUpdate(item._id);
                          }}
                        >
                          Purchased
                        </Button>
                      )}
                    </td>
                    <td>
                      <Group position="right">
                        <Button
                          component={Link}
                          to={"/items/" + item._id}
                          color="blue"
                          size="xs"
                          radius="5px"
                        >
                          Edit
                        </Button>
                        <Button
                          color="red"
                          size="xs"
                          radius="5px"
                          onClick={() => {
                            handleItemDelete(item._id);
                          }}
                        >
                          Delete
                        </Button>
                      </Group>
                    </td>
                  </tr>
                </tbody>
              </Table>
            );
          })
        ) : (
          <Grid.Col className="mt-5">
            <Space h="120px" />
            <h1 className="text-center text-muted">No List yet .</h1>
          </Grid.Col>
        )}
      </Grid>
    </>
  );
}

export default Items;
