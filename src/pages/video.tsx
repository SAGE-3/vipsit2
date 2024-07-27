import { ChangeEvent, MouseEvent, useState } from 'react';
import { Heading, FormControl, Box, FormLabel, FormHelperText, Input, Button, Link, HStack, List, Progress, } from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';

export default function VideoTab() {
  const [file, setFile] = useState<File | null>(null);
  const [newVideo, setNewVideo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    if (!fileInput.files) {
      return;
    }
    if (fileInput.files.length === 0) {
      return;
    }
    const ff = fileInput.files[0];
    if (!ff.type.startsWith("video")) {
      return;
    }
    console.log('Selected file:', ff.name, ff.type);
    setFile(ff);
  };

  const onUploadFile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) { return; }
    try {
      setUploading(true);
      let formData = new FormData();
      formData.append("media", file);

      const res = await fetch(window.location.pathname + "/api/upload_video", {
        method: "POST",
        body: formData,
      });

      const { data, error, }: {
        data: { url: string } | null;
        error: string | null;
      } = await res.json();

      if (error || !data) {
        alert(error || "Sorry! something went wrong.");
        setUploading(false);
        return;
      }
      console.log("Video was uploaded successfylly:", data);
      setNewVideo(data.url);
      setUploading(false);

    } catch (error) {
      console.error(error);
      alert("Sorry! something went wrong.");
      setUploading(false);
    }
  };

  return (
    <>
      <Heading as='h1' size='lg'>Video Processing</Heading>

      <Heading as='h2' size='md' mt={"25px"} mb={"5px"}>Upload a video</Heading>

      <FormControl
        onSubmit={(e) => e.preventDefault()}
      >
        <FormLabel>Select a video to upload:</FormLabel>
        <Input type='file' w={300} multiple={false} onChange={onFileUploadChange}
        />
        <FormHelperText>Video formats: mp4, mov, ...</FormHelperText>
        <Button
          mt={4}
          colorScheme='teal'
          type='submit'
          onClick={onUploadFile}
          disabled={uploading}
        >
          {uploading ? "Uploading" : "Upload"}
        </Button>

      </FormControl>

      {uploading &&
        <Progress m={2} w={"50%"} size='xs' isIndeterminate />
      }

      <Heading as='h2' size='md' mt={"25px"} mb={"5px"}>Processed Video</Heading>
      <List>
        {/* {images.map((image: any, i: number) => (<ListItem key={i} >
          <HStack p={1}>
            <Box overflow={"clip"} border={"1px"}>
              <Image w={200} h={120} alt="icon" src={image.image} objectFit={"cover"} />
            </Box>
            <Link download color='teal.500' href={image.link}> <em> {image.name}</em> <ExternalLinkIcon mx='2px' /> </Link>
          </HStack>
        </ListItem>
        ))} */}
        {newVideo &&
          <HStack p={1}>
            <Box overflow={"clip"} border={"1px"}>
              {/* <Image w={200} h={120} alt="icon" src={image.image} objectFit={"cover"} /> */}
            </Box>
            {/* <Link download color='teal.500' href={window.location.pathname + newVideo}> <em> {newVideo}</em> <ExternalLinkIcon mx='2px' /> </Link> */}
            <Link download color='teal.500' href={window.location.pathname + newVideo}> <em> {newVideo}</em> <ExternalLinkIcon mx='2px' /> </Link>
          </HStack>
        }
      </List >
    </>
  );
}