import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { Akira } from 'react-native-textinput-effects';
import { AppLoading, Font } from "expo";
import fetch from "node-fetch";
var removeAccents = require('remover-acentos');
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from "expo";

const ADUNITID = `ca-app-pub-9229129425030491~6641451270`;
const BANNER_ID = `ca-app-pub-9229129425030491/3604224393`;
const INTERSTITIAL_ID = `ca-app-pub-9229129425030491~6641451270`;
const REWARDED_ID = `ca-app-pub-9229129425030491~6641451270`;

AdMobInterstitial.setAdUnitID(INTERSTITIAL_ID);
AdMobInterstitial.setTestDeviceID("EMULATOR");
AdMobRewarded.setAdUnitID(REWARDED_ID);
AdMobRewarded.setTestDeviceID("EMULATOR");
console.disableYellowBox = true;

export default class App extends Component {
  _openInterstitial = async () => {
    await AdMobInterstitial.requestAdAsync();
    await AdMobInterstitial.showAdAsync();
  };

  _openRewarded = async () => {
    await AdMobRewarded.requestAdAsync();
    await AdMobRewarded.showAdAsync();
  };

  constructor(props) {
    super(props);

    this.state = {
      visibleModal: null,
      loaded: false,
      name: '',
      matricula: null,
    }

  }
  componentWillMount() {
    this._loadAssetsAsync();
  }

  _loadAssetsAsync = async () => {
    await Font.loadAsync({
      Arial: require("./assets/fonts/arial.ttf"),
    });
    this.setState({ loaded: true });
  };

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );


  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>Matrícula: {this.state.matricula}</Text>
      <Text>Senha do AlunoOnline: 123456</Text>
      {this._renderButton('Fechar', () => this.setState({ visibleModal: null }))}
    </View>
  );
  render() {
    if (!this.state.loaded) {
      return <AppLoading />;
    }

    return (
      <ScrollView>
      <Text></Text>
        <View style={[styles.card2, { backgroundColor: '#ffffff' }]}>
          <Text style={styles.title}>CONSULTAR MATRÍCULA WR</Text>
          <Akira
            label={'Nome Completo:'}
            borderColor={'#1a7ae0'}
            labelStyle={{ color: '#7cb1ea' }}
            onChangeText={name => this.setState({ name })}
          />

          {this._renderButton('Buscar', () => {
            fetch('http://sige.seduc.ce.gov.br/Consulta/Aluno/PesquisaAluno.asp?nm_aluno=' + removeAccents(this.state.name) + '&cd_unidade_trabalho=278&fl_tipo_pesquisa=I')
              .then(response => {
                let data = JSON.stringify(response);
                let indice = data.indexOf(".value = '"); indice += 9;
                console.log(indice);
                let datas = '';
                this.setState({ matricula: datas.concat(data[indice + 1], data[indice + 2], data[indice + 3], data[indice + 4], data[indice + 5], data[indice + 6], data[indice + 7]) });
                console.log(data);
                this.setState({ visibleModal: 1 })
              })
              .catch(error => console.log(error));

          })}
          <Modal isVisible={this.state.visibleModal === 1}>
            {this._renderModalContent()}
          </Modal>

          
        </View>
        <View style={styles.container}>
        <AdMobBanner
        bannerSize="banner"
        adUnitID={BANNER_ID}
        didFailToReceiveAdWithError={this.bannerError}
      />
        <AdMobBanner
        bannerSize="mediumRectangle"
        adUnitID={BANNER_ID}
        didFailToReceiveAdWithError={this.bannerError}
      />
        </View>
        
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: 'white',
    alignItems: "center",
    marginTop: 30
  },
  content: {
    // not cool but good enough to make all inputs visible when keyboard is active
    paddingBottom: 300,
  },
  card1: {
    paddingVertical: 16,
  },
  card2: {
    padding: 16,
  },
  input: {
    marginTop: 4,
  },
  title: {
    paddingBottom: 16,
    textAlign: 'center',
    color: '#404d5b',
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});