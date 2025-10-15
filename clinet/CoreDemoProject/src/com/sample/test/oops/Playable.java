package com.sample.test.oops;
//Create interface 'Playable' and implement it in class 'Game'.
public interface Playable {
	void cricket();
	void kabbadi();
	void volleyBall();
	void badmintion();

}
class Game implements Playable{
	 public void cricket() {
		System.out.println("Cricket is an international game");
	}
	 public void kabbadi() {
		System.out.println("The birthplace of kabbadi is India");
	}
	 public void volleyBall() {
		System.out.println("Volleyball is famous for teamwork and Coordination ");
	}
	public void badmintion() {
		System.out.println("The famous players for badmintion are PVSindhu and Saina Nehwal");
	}
	
	public static void main(String[] args) {
		Game game=new Game();
		game.cricket();
		game.kabbadi();
		game.volleyBall();
		game.badmintion();
	}
}

