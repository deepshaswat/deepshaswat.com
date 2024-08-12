// try {
//   // Step 1: Get the signed URL from your API
//   const { data } = await axios.post("/api/upload", {
//     name: file.name,
//     type: file.type,
//   });

//   const { url } = data;

//   // Step 2: Upload the file to S3 using the signed URL
//   await axios.put(url, file, {
//     headers: {
//       "Content-Type": file.type,
//     },
//   });

//   console.log(`${file.name} uploaded successfully.`);
// } catch (error) {
//   console.error(`Error uploading ${file.name}: `, error);
// }
