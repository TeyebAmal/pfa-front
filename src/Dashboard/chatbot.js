import React from 'react';
import { Chat } from '@progress/kendo-react-conversational-ui';
import axios from 'axios';
import { getCookie } from '../contants/cookies';

export default class Chatbot extends React.Component {
  constructor(props) {
    super(props);
    this.user = {
      id: 1,
    };
    this.bot = {
      id: 0,
      avatarUrl: "https://static.wixstatic.com/media/d57f38_583283f18ad84ea79f90c521b457f82b~mv2.png/v1/fill/w_426,h_426,al_c,q_85,usm_0.66_1.00_0.01/NyftyBot_small_512x512.webp"
    };
    this.state = {
      messageCount: 2,
      activeSymtom: null,
      question: [],
      name: '',
      questionType: 'single',
      age: 0,
      firstIndex: 0,
      symtomp: null,
      symptomsCount: 0,
      gender: 'male',
      messages: [
        {
          author: this.bot,
          timestamp: new Date(),
          text: "✋ Hi! I'm an automatic diagnosis."
        },
        {
          author: this.bot,
          timestamp: new Date(),
          text: "This service is for informational purposes and is not a qualified medical opinion."
        },
        {
          author: this.bot,
          timestamp: new Date(),
          text: "what's your name ?"
        },

      ]
    };
  }


  addNewMessage = async (event) => {
    if (this.state.messageCount === 0) {
      console.log('1')
      let botResponce = Object.assign({}, event.message);
      botResponce.text = 'How old are you ?';
      botResponce.author = this.bot;
      this.setState((prevState) => ({
        messages: [
          ...prevState.messages,
          event.message
        ]
      }));
      this.setState({ name: event.message.text, messageCount: 2 })
      setTimeout(() => {
        this.setState(prevState => ({
          messages: [
            ...prevState.messages,
            botResponce
          ]
        }));
      }, 1000);
    } else if (this.state.messageCount === 1) {
      console.log('2')
      let botResponce = Object.assign({}, event.message);
      botResponce.text = 'Are you female or male ?';
      botResponce.author = this.bot;
      this.setState((prevState) => ({
        messages: [
          ...prevState.messages,
          event.message
        ]
      }));
      this.setState({ age: event.message.text, messageCount: 2 })
      setTimeout(() => {
        this.setState(prevState => ({
          messages: [
            ...prevState.messages,
            botResponce
          ]
        }));
      }, 1000);
    } else if (this.state.messageCount === 2) {
      console.log(event.message.text)
      let botResponce = Object.assign({}, event.message);
      botResponce.text = 'What concerns you most about your health? Please describe your symptoms.';
      botResponce.author = this.bot;
      this.setState((prevState) => ({
        messages: [
          ...prevState.messages,
          event.message
        ]
      }));
      this.setState({ age: event.message.text, messageCount: 3 })
      setTimeout(() => {
        this.setState(prevState => ({
          messages: [
            ...prevState.messages,
            botResponce
          ]
        }));
      }, 1000);
    } else if (this.state.messageCount === 3) {
      this.setState((prevState) => ({
        messages: [
          ...prevState.messages,
          event.message
        ]
      }));
      // const context = {
      //   sex: this.state.gender,
      //   phrase: event.message.text,
      //   type: "symptom",
      //   maxResults: 8
      // }
      const context = {
        "text": event.message.text,
      }
      const symtomsRequest = await axios.post('http://localhost:3030/getSearch', context)
      console.log(symtomsRequest);
      if (symtomsRequest.data.mentions.length > 0) {
        const symtomsRespose = await axios.get(`http://localhost:3030/getsymptomes/${symtomsRequest.data.mentions[0].id}`);
        let botResponce = Object.assign({}, event.message);
        botResponce.text = symtomsRespose.data.symptom.question;
        botResponce.author = this.bot;
        const symtomp = {
          sex: "male",
          age: 70,
          evidence: [
            {
              "id": symtomsRequest.data.mentions[0].id,
              "choice_id": "present",
              "initial": "true"
            },
          ]
        }
        this.setState({ messageCount: 4, symtomp })
        setTimeout(() => {
          this.setState(prevState => ({
            messages: [
              ...prevState.messages,
              botResponce
            ]
          }));
        }, 1000);
      } else {
        let botResponce = Object.assign({}, event.message);
        botResponce.text = 'I am sorry but I didnt understand.Please name your symptoms using simple language.';
        botResponce.author = this.bot;
        setTimeout(() => {
          this.setState(prevState => ({
            messages: [
              ...prevState.messages,
              botResponce
            ]
          }));
        }, 1000);
      }
    } else if (this.state.messageCount === 4) {
      if (event.message.text !== 'yes') {
        let botResponce = Object.assign({}, event.message);
        botResponce.text = 'Please describe your symptoms.';
        botResponce.author = this.bot;
        this.setState((prevState) => ({
          messages: [
            ...prevState.messages,
            event.message
          ]
        }));
        this.setState({ messageCount: 3 })
        setTimeout(() => {
          this.setState(prevState => ({
            messages: [
              ...prevState.messages,
              botResponce
            ]
          }));
        }, 1000);
      } else {
        if (this.state.symptomsCount === 0) {
          this.setState((prevState) => ({
            messages: [
              ...prevState.messages,
              event.message
            ]
          }));
          const symtomsRespose = await axios.post(`http://localhost:3030/postsymptomes`, this.state.symtomp);
          console.log('****', symtomsRespose.data.should_stop)
          let botResponce = Object.assign({}, event.message);
          if (symtomsRespose.data.question) {
            const { question } = this.state;
            const index = question.findIndex(key => key.name === symtomsRespose.data.question.text && key.quest === symtomsRespose.data.question.items.length);
            if (index === -1) {
              question.push({ name: symtomsRespose.data.question.text, quest: symtomsRespose.data.question.items.length })
              this.setState({ question });
              if (symtomsRespose.data.question.type !== 'single') {
                botResponce.text = symtomsRespose.data.question.text;
                const array = [];
                symtomsRespose.data.question.items.map((elem, index) => {
                  let obj = {
                    type: 'reply',
                    value: elem.name
                  }
                  array.push(obj)
                })
                botResponce.suggestedActions = array
                botResponce.author = this.bot;
                this.setState({ messageCount: 5, symptomsCount: 1, firstIndex: 11, activeSymtom: symtomsRespose.data.question })
                setTimeout(() => {
                  this.setState(prevState => ({
                    messages: [
                      ...prevState.messages,
                      botResponce
                    ]
                  }));
                }, 1000);
              } else {
                botResponce.text = symtomsRespose.data.question.text + '(else write no)';
                const array = [];
                symtomsRespose.data.question.items.map((elem, index) => {
                  let obj = {
                    type: 'reply',
                    value: elem.name
                  }
                  array.push(obj)
                })
                botResponce.suggestedActions = array
                botResponce.author = this.bot;

                this.setState({ messageCount: 5, symptomsCount: 1, activeSymtom: symtomsRespose.data.question })
                setTimeout(() => {
                  this.setState(prevState => ({
                    messages: [
                      ...prevState.messages,
                      botResponce
                    ]
                  }));
                }, 1000);
              }
            } else {
              console.log('trie')
            }
          } else {
            let botResponce = Object.assign({}, event.message);
            botResponce.text = 'I am sorry :( I did not understand';
            botResponce.author = this.bot;
            setTimeout(() => {
              this.setState(prevState => ({
                messages: [
                  ...prevState.messages,
                  botResponce
                ]
              }));
            }, 1000);
          }
        } else {
          console.log('aaaaaaaaa')
        }
      }
    } else {
      const { activeSymtom, symtomp } = this.state;
      const activeId = activeSymtom.items.find(key => key.name === event.message.text);
      if (activeId) {
        symtomp.evidence.push({ id: activeId.id, choice_id: "present" });
      } else {
        if (event.message.text === 'yes') {
          symtomp.evidence.push({ id: activeSymtom.items[0].id, choice_id: "present" });
        } else if (event.message.text === 'no') {
          symtomp.evidence.push({ id: activeSymtom.items[0].id, choice_id: "absent" });
        } else {
          symtomp.evidence.push({ id: activeSymtom.items[0].id, choice_id: "unknown" });
        }
      }
      this.setState((prevState) => ({
        messages: [
          ...prevState.messages,
          event.message
        ]
      }));
      const symtomsRespose = await axios.post(`http://localhost:3030/postsymptomes`, this.state.symtomp);
      if (!symtomsRespose.data.should_stop) {
        let botResponce = Object.assign({}, event.message);
        if (symtomsRespose.data.question) {

          const { question } = this.state;
          const index = question.findIndex(key => key.name === symtomsRespose.data.question.text && key.quest === symtomsRespose.data.question.items.length);
          if (index === -1) {
            question.push({ name: symtomsRespose.data.question.text, quest: symtomsRespose.data.question.items.length })
            this.setState({ question });
            if (symtomsRespose.data.question.type !== 'single') {
              botResponce.text = symtomsRespose.data.question.text;
              const array = [];
              symtomsRespose.data.question.items.map((elem, index) => {
                let obj = {
                  type: 'reply',
                  value: elem.name
                }
                array.push(obj)
              })
              botResponce.suggestedActions = array
              botResponce.author = this.bot;

              this.setState({ messageCount: 5, firstIndex: 11, symptomsCount: 1, activeSymtom: symtomsRespose.data.question })
              setTimeout(() => {
                this.setState(prevState => ({
                  messages: [
                    ...prevState.messages,
                    botResponce
                  ]
                }));
              }, 1000);
            } else {
              botResponce.text = symtomsRespose.data.question.text + '(else write no)';
              const array = [];
              symtomsRespose.data.question.items.map((elem, index) => {
                let obj = {
                  type: 'reply',
                  value: elem.name
                }
                array.push(obj)
              })
              botResponce.suggestedActions = array
              botResponce.author = this.bot;

              this.setState({ messageCount: 5, symptomsCount: 1, activeSymtom: symtomsRespose.data.question })
              setTimeout(() => {
                this.setState(prevState => ({
                  messages: [
                    ...prevState.messages,
                    botResponce
                  ]
                }));
              }, 1000);
            }
          } else {
            console.log('tttt')
          }
        } else {
          let botResponce = Object.assign({}, event.message);

          botResponce.text = 'I am sorry :( I did not understand';
          botResponce.author = this.bot;
          setTimeout(() => {
            this.setState(prevState => ({
              messages: [
                ...prevState.messages,
                botResponce
              ]
            }));
          }, 1000);
        }
      } else {
        let botResponce = Object.assign({}, event.message);
        let ch = "";
        console.log('aaaaaaaaaaaaaaa', this.state.symtomp, symtomsRespose.data.conditions)
        symtomsRespose.data.conditions.map((elem, index) => {
          if (index === symtomsRespose.data.conditions.length - 1) {
            ch = ch + ' ' + 'probability of ' + elem.probability * 100 + '% having ' + elem.name
          } else {
            ch = ch + ' ' + 'probability of ' + elem.probability * 100 + '% having ' + elem.name + 'or '
          }
        })
        const user = JSON.parse(getCookie('user'));

        axios.post('http://localhost:3030/stat/stat', {
          "user": user._id,
          "Diagnosis": symtomsRespose.data.conditions
        }).then(data => {
          console.log(data)
          this.props.history.push(`/stat/${data.data.job._id}`)
        }).catch(err => console.log(err))

      }
    }

  };

  countReplayLength = (question) => {
    let length = question.length;
    let answer = question + " contains exactly " + length + " symbols.";
    return answer;
  }
  componentDidMount() {
    const user = JSON.parse(getCookie('user'));
    const messages = [
      {
        author: this.bot,
        timestamp: new Date(),
        text: `✋ Welcome ${user.firstName + ' ' + user.lastName + ' '}`
      },
      {
        author: this.bot,
        timestamp: new Date(),
        text: "This service is for informational purposes and is not a qualified medical opinion."
      },
      {
        author: this.bot,
        timestamp: new Date(),
        text: "How old are you ?"
      },

    ]
    this.setState({messages, gender : user.gender})
  }
  render() {
    return (
      <div>
        <Chat user={this.user}
          ref={ref => this.ChatRef = ref}
          messages={this.state.messages}
          onMessageSend={this.addNewMessage}
          placeholder={"Type a message..."}
          width={400}>
        </Chat>
      </div>
    );
  }
}



