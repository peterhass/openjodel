import React from 'react'
import { View, 
  Text, 
  Modal,
  FlatList, 
  Button, 
  StyleSheet, 
  ImageBackground,
  Image,
  TouchableHighlight, 
  TouchableOpacity } from 'react-native'
import Moment from 'react-moment'
import { Ionicons } from '@expo/vector-icons'

const PostBackground = ({ imageUrl, children, ...props }) => {
  if (imageUrl)
    return (<ImageBackground 
      blurRadius={20}
      source={{uri: imageUrl }} 
      {...props}>{children}</ImageBackground>)

  return (<View {...props}>{children}</View>)
}

export default class Post extends React.Component {
  constructor() {
    super()
    this.state = { showImageModal: false }
  }
  
  render() {
    const {
      message,
      insertedAt,
      votingScore,
      currentUserVotingScore: currentVote,
      participant,
      imageUrl,
      id,
      children,
      onResetVote,
      onUpvote,
      onDownvote,
      onNavigateComments
    } = this.props

    const {
      showImageModal
    } = this.state

    const { name: participantName } = participant || {}

    // TODO: time to clean up this mess

    let onPress = () => {}
    if (onNavigateComments && id)
      onPress = () => onNavigateComments(id)

    let onLongPress = () => {}
    if (imageUrl)
      onLongPress = () => {
        this.setState({ showImageModal: true })
      } 

    return (
      <TouchableHighlight onPress={onPress} onLongPress={onLongPress}>
        <View>
          { imageUrl &&
              <Modal 
                transparent={false}
                visible={showImageModal}
                style={styles.modalImageContainer}
             >
               <TouchableOpacity
                 onPress={() => this.setState({ showImageModal: false })}
                 style={{flex: 1}}
               >
                <Image source={{uri: imageUrl}} style={styles.modalImage}/>
              </TouchableOpacity>
            </Modal>
          }

          <PostBackground imageUrl={imageUrl} style={styles.box}>
            <View style={[styles.header]}>
              { participantName &&
                <Text style={[styles.headerItemContainer, styles.headerText]}>@{participantName}</Text>
              }
              <Moment fromNow element={Text} style={[styles.boxText, styles.headerText]}>{ insertedAt }</Moment>         
            </View>

            <View style={styles.body}>
              <View style={styles.messageBox}>
                <Text style={[styles.boxText, styles.messageText]}>{ message }</Text>
              </View>
              <View style={styles.votingBox}>
                <TouchableHighlight 
                  style={styles.votingButton}
                  onPress={currentVote == 1 ? onResetVote : onUpvote}
                >
                  <Ionicons name="md-arrow-up" size={20} color={currentVote == 1 ? 'red' : 'white'} />
                </TouchableHighlight>

                <Text style={[styles.boxText, styles.voting]}>{ votingScore ? votingScore : 0 }</Text>
                <TouchableHighlight 
                  style={styles.votingButton}
                  onPress={currentVote == -1 ? onResetVote : onDownvote}
                >
                  <Ionicons name="md-arrow-down" size={20} color={currentVote == -1 ? 'red' : 'white'} />
                </TouchableHighlight>




              </View>
            </View>
            { onNavigateComments && 
              <View style={styles.footer}>
                <Text style={[styles.boxText]}>Ϡ { children.length }</Text>
              </View>
            }
          </PostBackground>
        </View>
      </TouchableHighlight>
    )
  }

  
}

const styles = StyleSheet.create({
  modalImageContainer: {
  },

  modalImage: {
    flex: 1,
    resizeMode: 'stretch'
  },
  
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
    flexDirection: 'row'
  },

  headerItemContainer: {
    marginRight: 10,
    fontWeight: 'bold'
  },

  headerText: {
    color: '#deeab9'
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },

  messageBox: {
    marginTop: 10,
    width: '85%'
  },

  
  votingBox: {
    width: '15%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch'
  },

  votingButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'

  },

  voting: {
    textAlign: 'center',
    marginVertical: 10
  }

})
