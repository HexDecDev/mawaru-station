import React, { Component } from 'react';
import { List } from 'semantic-ui-react'

class NextSong extends Component
{
    render(){

        

        return(

                <List.Item>
                    <List.Icon name='file audio outline' />
                    <List.Content>
                        <div id = 'NextSong'>{this.props.playlist}</div>
                    </List.Content>
                </List.Item>

        );

    }
}

export default NextSong;