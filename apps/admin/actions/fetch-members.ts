export async function fetchMemberDetails(id: string) {
  // ToDo: Replace with actual data fetching logic
  const members = [
    {
      id: "1",
      name: "John Doe",
      email: "john@gmail.com",
      description: "test",
      openRate: "N/A",
      location: "Unknown",
      created: "2024-07-24",
      image: "",
      subscribed: true,
    },
    {
      id: "2",
      name: "Sarah",
      email: "sarah@gmail.com",
      openRate: "N/A",
      location: "California, US",
      created: "2023-12-2",
      image: "",
      subscribed: true,
    },
    {
      id: "3",
      name: "",
      email: "rahul@gmail.com",
      openRate: "N/A",
      location: "India",
      created: "2021-09-01",
      image: "",
      subscribed: false,
    },
  ];
  return members.find((member) => member.id === id) || null;
}
