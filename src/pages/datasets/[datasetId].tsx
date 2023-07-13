import { NavigationPageWithRedirectProtection } from "@/components"
import { DatasetExplorerPage } from "@/features"
import { GetServerSideProps } from "next"
import React from "react"

const DatasetExplorer: React.FC<{ datasetId: string | undefined }> = ({
  datasetId,
}) => {
  return (
    <NavigationPageWithRedirectProtection title={"Roboto - Dataset Explorer"}>
      <DatasetExplorerPage datasetId={datasetId} />
    </NavigationPageWithRedirectProtection>
  )
}

export default DatasetExplorer

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Note: the context parameter "datasetId" comes from the file name [datasetId].tsx
  const datasetId = context.params?.datasetId

  return {
    props: {
      datasetId: datasetId,
    },
  }
}
