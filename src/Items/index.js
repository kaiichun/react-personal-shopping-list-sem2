import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Title, Grid, Group, Space, Button } from "@mantine/core";
import { Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchItems = async (priority = "", purchased = "") => {
  const response = await axios.get(
    "http://localhost:9999/items?" +
      (priority !== "" ? "priority=" + priority : "") +
      (purchased !== "" ? "&purchased=" + purchased : "")
  );
  return response.data;
};

const updataPurchasedItem = async (item_id = "") => {
  const response = await axios({
    method: "PUT",
    url: "http://localhost:9999/items/" + item_id + "/purchased",
    // purchased: true,
  });
  return response.data;
};

const unupdataPurchasedItem = async (item_id = "") => {
  const response = await axios({
    method: "PUT",
    url: "http://localhost:9999/items/" + item_id + "/unpurchased",
    // purchased: false,
  });
  return response.data;
};

const deleteItem = async (item_id = "") => {
  const response = await axios({
    method: "DELETE",
    url: "http://localhost:9999/items/" + item_id,
  });
  return response.data;
};

function Items() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  //   const [items, setItems] = useState([]);
  const [priority, setPriority] = useState("");
  const [purchased, setPurchased] = useState("");
  const {
    isLoading,
    isError,
    data: items,
    error,
  } = useQuery({
    queryKey: ["items", priority, purchased],
    queryFn: () => fetchItems(priority, purchased),
  });

  const memoryItems = queryClient.getQueryData(["items", "", ""]);
  const priorityOptions = useMemo(() => {
    let options = [];
    if (memoryItems && memoryItems.length > 0) {
      memoryItems.forEach((item) => {
        if (!options.includes(item.priority)) {
          options.push(item.priority);
        }
      });
    }
    return options;
  }, [memoryItems]);

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items", priority, purchased],
      });
      notifications.show({
        title: "Shopping List Deleted",
        color: "green",
      });
    },
  });

  const unupdateMutation = useMutation({
    mutationFn: unupdataPurchasedItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items", priority, purchased],
      });
      notifications.show({
        title: "item purchased already",
        color: "gray",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updataPurchasedItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items", priority, purchased],
      });
      notifications.show({
        title: "ITEM no yet purchased !!!",
        color: "yellow",
      });
    },
  });

  return (
    <>
      <Space h="20px" />{" "}
      <Group position="center">
        <select
          onChange={(event) => {
            setPriority(event.target.value);
          }}
        >
          <option value="">All Priority</option>
          {priorityOptions.map((priority) => {
            return (
              <option key={priority} value={priority}>
                {priority}
              </option>
            );
          })}
        </select>
        <select
          value={purchased}
          onChange={(event) => {
            setPurchased(event.target.value);
          }}
        >
          <option value="">All</option>
          <option value="true">Unpurchased</option>
          <option value="false">Purchased</option>
        </select>
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
          </thead>{" "}
          {items ? (
            items.map((item) => {
              return (
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
                            unupdateMutation.mutate(item._id);
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
                            updateMutation.mutate(item._id);
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
                            deleteMutation.mutate(item._id);
                          }}
                        >
                          Delete
                        </Button>
                      </Group>
                    </td>
                  </tr>
                </tbody>
              );
            })
          ) : (
            <Grid.Col className="mt-5">
              <Space h="120px" />
              <h1 className="text-center text-muted">No List yet .</h1>
            </Grid.Col>
          )}
        </Table>
      </Grid>
    </>
  );
}

export default Items;
