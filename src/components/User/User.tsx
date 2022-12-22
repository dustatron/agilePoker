import { Box, Spinner, Text } from "@chakra-ui/react"

import React from "react"

type Props = {
  name: string
  isVoting: boolean
  vote: number | null
  isCurrentUser: boolean
}

const User = ({ name, isVoting, vote, isCurrentUser }: Props) => {
  const hasVote = vote && vote > 0
  return (
    <Box
      borderWidth="3px"
      borderColor="#e7e7e7"
      padding={4}
      minH="120px"
      minW="150px"
      borderRadius="xl"
      bg="white"
      // boxShadow="md"
    >
      {name && (
        <Text textAlign="center" fontSize="xl" fontWeight="bold">
          {name}
        </Text>
      )}
      <Text textAlign="center" fontSize="2xl" fontWeight="bold">
        {isVoting && !!hasVote && "👍"}
        {isVoting && !hasVote && (<Spinner />)}
      </Text>
      {!isVoting && (
        <Text textAlign="center" fontSize="3xl">
          {vote}
        </Text>
      )}
    </Box>
  )
}

export default User
