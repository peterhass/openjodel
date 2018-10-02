import React from 'react'
import { View, Text, FlatList, Button, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native'
import Moment from 'react-moment'

class LinkBox extends React.Component {
  render() {
    const { onNavigateComments, id, children } = this.props

    if (onNavigateComments && id)
      return (<TouchableHighlight onPress={() => onNavigateComments(id)}>{children}</TouchableHighlight>)

    return (<View>{children}</View>)
  }
}

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
      onNavigateComments
    } = this.props

    const { name: participantName } = participant || {}

    return (
      <LinkBox id={id} onNavigateComments={onNavigateComments}>
        <View style={styles.box}>
          <View style={[styles.header]}>
            <Moment fromNow element={Text} style={[styles.boxText, styles.headerText]}>{ insertedAt }</Moment>         
          </View>

          <View style={styles.body}>
            <View style={styles.messageBox}>
              <Text style={[styles.boxText, styles.messageText]}>{ message }</Text>
            </View>
            <View style={styles.votingBox}>
              <Button color={currentVote == 1 ? 'red' : 'white'} title="↑" onPress={currentVote == 1 ? onResetVote : onUpvote} />
              <Text style={[styles.boxText, styles.voting]}>{ votingScore }</Text>
              <Button color={currentVote == -1 ? 'red' : 'white'} title="↓" onPress={currentVote == -1 ? onResetVote : onDownvote} />
            </View>
          </View>
          { onNavigateComments && 
            <View style={styles.footer}>
              <Text style={[styles.boxText]}>Ϡ { children.length }</Text>
            </View>
          }
        </View>
      </LinkBox>
    )
  }

  
}

const styles = StyleSheet.create({
  boxText: {
    color: 'white'
  },

  box: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,

    backgroundColor: '#9ec41c',
  },

  header: {
    flex: 0,
  },

  headerText: {
    color: '#deeab9'
  },
  body: {
    flex: 1,
    flexDirection: 'row'
  },

  messageBox: {
    marginTop: 10,
    width: '90%'
  },

  
  votingBox: {
    width: '10%',
  },

  voting: {
    textAlign: 'center'
  }

})
