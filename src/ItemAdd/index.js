import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  Divider,
  NumberInput,
  Button,
  Group,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const addItem = async (data) => {
  const response = await axios({
    method: "POST",
    url: "http://localhost:9999/items",
    headers: { "Content-Type": "application/json" },
    data: data,
  });
  return response.data;
};

function ItemAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("");
  const [priority, setPriority] = useState("");

  const createMutation = useMutation({
    mutationFn: addItem,
    onSuccess: () => {
      notifications.show({
        title: "Item Added",
        color: "green",
      });

      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleAddNewItem = async (event) => {
    event.preventDefault();
    createMutation.mutate(
      JSON.stringify({
        name: name,
        quantity: quantity,
        unit: unit,
        priority: priority,
      })
    );
  };

  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Add New Item
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the list name here.."
          label="Name"
          description="What is the list"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <NumberInput
          value={quantity}
          placeholder="Enter the quantity here"
          label="Quantity"
          description="what is the quantity"
          withAsterisk
          onChange={setQuantity}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={unit}
          placeholder="Enter the unit here"
          label="Unit"
          description="What is the unit"
          withAsterisk
          onChange={(event) => setUnit(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={priority}
          placeholder="Enter the priority here"
          label="Priority"
          description="What is priority?"
          withAsterisk
          onChange={(event) => setPriority(event.target.value)}
        />
        <Space h="20px" />
        <Button fullWidth onClick={handleAddNewItem}>
          Add New Item
        </Button>
      </Card>
      <Space h="50px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="50px" />
    </Container>
  );
}

export default ItemAdd;
