export async function getData() {
  try {
    const responsive = await fetch("./data.json"); 

    if (!responsive.ok) {
      throw new Error("Failed to load data, status:" + responsive.status);
    }
    const data = await responsive.json();
    return data;
  } catch (error) {
    console.log("Error fetching quiz data:", error);
    throw error;
  }
}

