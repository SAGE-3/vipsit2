import { Heading, Box, Tabs, Tab, TabList, TabPanel, TabPanels } from "@chakra-ui/react";

import InfoTab from "./info";
import ImageTab from "./image";
import VideoTab from "./video";

export default function Page() {
  return (
    // Main Container
    <Box display="flex" flexDir={"column"} width="100%" height="100%" alignItems="center" justifyContent="space-between">

      <Heading>VipsIt 2</Heading>

      <Tabs width={"100%"} p={5}>
        <TabList width={"100%"}>
          <Tab width={"33%"}>Image Processing</Tab>
          <Tab width={"33%"}>Video Processing</Tab>
          <Tab width={"33%"}>Information</Tab>
        </TabList>

        <TabPanels>

          <TabPanel m={5}>
            <ImageTab />
          </TabPanel>

          <TabPanel m={5}>
            <VideoTab />
          </TabPanel>

          <TabPanel m={5}>
            <InfoTab />
          </TabPanel>

        </TabPanels>
      </Tabs>

    </Box>
  );
}
