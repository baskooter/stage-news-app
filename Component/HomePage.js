/**
 * (C) 2020: Quo Vide B.V.
 */

import React, { useEffect, useState } from 'react';

import { SafeAreaView, FlatList, StyleSheet, Text, View, Image, TouchableOpacity, Linking } from 'react-native';

import * as Constants from './src/Constants/Constants'

import Tts from 'react-native-tts';

export const App = props => {

	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	Tts.setDefaultLanguage('nl-NL');

	useEffect(() => {
		loadData();
	}, [page]);

	const loadData = async () => {
		try {
			let url = Constants.pageUrl + page;
			const resJson = await (await fetch(url)).json();
			let articleArray = resJson.articles.map(fillArticleArray);

			for(let i = 0; i<articleArray.length; i++){
				if(articleArray[i].urlToImage == null){
					articleArray.splice(i,1);
				}
			}
		
		  	setData(data.concat(articleArray));
		
		} catch (error) {
			console.log(error);
		}
	}
	
	function fillArticleArray(articles){
			let articleArray = {
				title: articles.title,
				urlToImage: articles.urlToImage,
				url: articles.url,
				description: articles.description,
				publishedAt: articles.publishedAt
			}
			return articleArray;
	}

	// Opens the url of the article you clicked

	const getListViewItem = (item) => {
		Linking.openURL(item.url);
	}
	const startSpeaker = (item) => {
		Tts.speak(item.title, {
			rate: 1,
		});
	}

	const renderItem = ({ item }) => (
		<>
			<SafeAreaView>
				<TouchableOpacity onPress={getListViewItem.bind(this, item)}>
					<View>
						<Text style={styles.articleTitle}>{item.title}</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={startSpeaker.bind(this, item)}>
					<View style={{ alignItems: 'center' }}>
						<Image source={{ uri: item.urlToImage }} style={styles.articleImage}></Image>
						
						<Image source={{ uri: 'https://image.flaticon.com/icons/png/512/37/37420.png'}} style={styles.speakerImage}/>
					</View>
				</TouchableOpacity>
					<View>
						<Text style={styles.articleDate}>{item.publishedAt?.replace("Z", " ").replace("T", " ")}</Text>
						<Text style={styles.articleDescription}>{item.description}</Text>
					</View>
				
			</SafeAreaView>
		</>
	)
 
	return (
		<>
			<View style={styles.appTitleView}>
				<Image source={{ uri: 'https://iconsplace.com/wp-content/uploads/_icons/ffffff/256/png/news-icon-18-256.png' }}
					style={styles.headerImage} />
				<Text style={styles.appTitle}>News app</Text>
			</View>
			<View style={styles.container}>
				<FlatList
					data={data}
					renderItem={renderItem}
					keyExtractor={(item, index) => index.toString()}
					onEndReached = { () =>  setPage(page + 1) }
					onEndReachedThreshold={0.1}
				/>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFF'
	},
	item: {
		padding: 8,
		fontSize: 16,
		height: 44,
	},
	articleTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		fontFamily: (Platform.OS === 'ios') ? 'San Francisco' : 'Roboto',
		paddingLeft: 8,
		paddingRight: 8,
		paddingBottom: 8,
		color: '#333333'
	},
	articleImage: {
		width: 416,
		height: 256,
	},
	speakerImage: {
		width: 100,
		height: 100,
		zIndex: 5,
		position: 'absolute',
		left: 300,
	},
	articleDate: {
		paddingTop: 4,
		fontSize: 16,
		fontFamily: (Platform.OS === 'ios') ? 'San Francisco' : 'Roboto',
		paddingLeft: 8,
		paddingRight: 8,
		color: '#333333'
	},
	articleDescription: {
		paddingTop: 8,
		fontSize: 16,
		fontFamily: (Platform.OS === 'ios') ? 'San Francisco' : 'Roboto',
		paddingBottom: 32,
		paddingLeft: 8,
		paddingRight: 8,
		color: '#333333'
	},
	appTitleView: {
		height: 76,
		width: window.width,
		backgroundColor: '#0077CC',
		shadowOffset: { width: -5, height: 4 },
		shadowColor: 'black',
		shadowOpacity: 10,
		shadowRadius: 2.22,
		elevation: 10,
		zIndex: 1,
		borderBottomStartRadius: 2,
		borderBottomEndRadius: 2,
		flexDirection: 'row',
	},
	appTitle: {
		fontSize: 32,
		paddingLeft: 80,
		fontWeight: 'bold',
		fontFamily: (Platform.OS === 'ios') ? 'San Francisco' : 'Roboto',
		paddingTop: 16,
		color: '#FFF',
	},
	headerImage: {
		width: 40,
		height: 40,
		marginTop: 8,
		marginLeft: 8,
	}
})

export default App; 
