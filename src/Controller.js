const { Console } = require('@woowacourse/mission-utils');
const BridgeGame = require('./BridgeGame');
const Validator = require('./Validator');
const OutputView = require('./OutputView');

class Controller {
  handleGameStart() {
    Console.print('다리 건너기 게임을 시작합니다.');
    Console.print('');
    this.count = 1;
    this.handleMakeBridge();
  }

  handleMakeBridge() {
    Console.readLine('다리의 길이를 입력해주세요.\n', (input) => {
      try {
        Validator.validateIsNumber(input);
        Validator.validateInRange(3, 20, input);
        this.bridgeGame = new BridgeGame(input);
        Console.print('');
        this.handleMove();
      } catch (err) {
        Console.print(`\n${err.message}`);
        this.handleMakeBridge();
      }
    });
  }

  handleMove() {
    Console.readLine('이동할 칸을 선택해주세요. (위: U, 아래: D)\n', (input) => {
      try {
        Validator.validateIncludes(['U', 'D'], input);
        const { resultToString, gameStatus } = this.bridgeGame.move(input);
        OutputView.printMap(resultToString);
        Console.print('');
        if (gameStatus === 2) this.handleGameEnd();
        if (gameStatus === 1) this.handleGameOver();
        if (gameStatus === 0) this.handleMove();
      } catch (err) {
        Console.print(`\n${err.message}`);
        this.handleMove();
      }
    });
  }

  handleGameOver() {
    Console.readLine('게임을 다시 시도할지 여부를 입력해주세요. (재시도: R, 종료: Q)\n', (input) => {
      try {
        Validator.validateIncludes(['R', 'Q'], input);
        if (input === 'R') this.handleGameRetry();
        if (input === 'Q') this.handleGameEnd();
      } catch (err) {
        Console.print(`\n${err.message}`);
        this.handleGameOver();
      }
    });
  }

  handleGameRetry() {
    this.bridgeGame.retry();
    this.count += 1;
    this.handleMove();
  }

  handleGameEnd() {
    const { upperPart, lowerPart } = this.bridgeGame.getResultMap();
    Console.print('최종 게임 결과');
    OutputView.printMap(upperPart, lowerPart);
    Console.print('');
    Console.print(`게임 성공 여부: ${this.bridgeGame.getGameStatus() === 1 ? '실패' : '성공'}`);
    Console.print(`총 시도한 횟수: ${this.count}`);
  }
}

module.exports = Controller;
