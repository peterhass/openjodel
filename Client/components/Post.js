import React from 'react'
import { View, Text, FlatList, Button, StyleSheet } from 'react-native'
import Moment from 'react-moment'

export default class Post extends React.Component {
  render() {
    const {
      message,
      insertedAt,
      votingScore,
      currentUserVotingScore: currentVote,
      participant,
      id,
      children,
      onResetVote,
      onUpvote,
      onDownvote,
      CommentLink
    } = this.props

    const { name: participantName } = participant || {}

    return (
      <View style={styles.box}>
        <View style={styles.header}>
          <Moment fromNow element={Text}>{ insertedAt }</Moment>         
        </View>

        <View style={styles.body}>
          <View style={styles.messageBox}>
            <Text>{ message }</Text>
          </View>
          <View style={styles.votingBox}>
            <Button color={currentVote == 1 ? 'red' : 'blue'} title="↑" onPress={currentVote == 1 ? onResetVote : onUpvote} />
            <Text style={styles.voting}>{ votingScore }</Text>
            <Button color={currentVote == -1 ? 'red' : 'blue'} title="↓" onPress={currentVote == -1 ? onResetVote : onDownvote} />
          </View>
        </View>
        <View style={styles.footer}>
          { children.length }
        </View>
      </View>
    )
  }

  
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'column',
    padding: 30,

    color: 'white',
    backgroundColor: '#9ec41c',

    marginBottom: 5
  },

  header: {
    flex: 0,
  },

  body: {
    flex: 1,
    flexDirection: 'row'
  },

  messageBox: {
    width: '90%'
  },

  votingBox: {
    width: '10%',
  },

  voting: {
    textAlign: 'center'
  }

})
