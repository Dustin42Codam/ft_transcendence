import time
import unittest
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from dotenv import load_dotenv
from pathlib import Path



def element_exists(driver, text):
    """If driver.find_element can not find element then it will crash"""
    try:
        driver.find_element("xpath", text)
        return True
    except:
        return False



class TestLogin(unittest.TestCase):
    #driver = webdriver.Chrome()
    driver = webdriver.Firefox()
    driver.get("http://localhost:4242")

    def test_1_login(self):
        dotenv_path = Path('.env.mine')
        load_dotenv(dotenv_path=dotenv_path)
        userName = os.getenv('USER_NAME')
        password = os.getenv('PASSWORD')
        time.sleep(1)
        button_elem = self.driver.find_element("xpath", "//button[@class='chatButton']")
        button_elem.click()
        time.sleep(2)

        usesrnameInput = self.driver.find_element("xpath", "//input[@class='login-control string optional']")
        passwordInput = self.driver.find_element("xpath", "//input[@class='login-control password optional']")
        usesrnameInput.send_keys(userName);
        passwordInput.send_keys(password);
        button_elem = self.driver.find_element("xpath", "//input[@class='btn btn-login']")
        button_elem.click()
        time.sleep(1)
        if element_exists(self.driver, "//input[@class='login-control string optional' and @id='users_code']"):
            tFInput = self.driver.find_element("xpath", "//input[@class='login-control string optional' and @id='users_code']")
            tFInput.send_keys(input("input 2fa code:"))
            button_elem = self.driver.find_element("xpath", "//input[@class='btn btn-primary']")
            button_elem.click()

            time.sleep(1)
        button_elem = self.driver.find_element("xpath", "//input[@class='btn btn-success btn-lg btn-block']")
        button_elem.click()
        time.sleep(1)
        print("E: http://localhost:4242/\nG: " + self.driver.current_url)
        self.assertTrue(self.driver.current_url == "http://localhost:4242/", "CAN NOT SEE LOGIN IN ATLEAST BROWSER DOES NOT REDIRECT TO http://localhost:4242/")
    """
    def test_2_storage(self):
        self.assertTrue(element_exists(self.driver, "//div[@id='storeage-used' and @class='card card-stats']"), "CAN NOT SEE STORAGE WHEN LOGIN IN")
    def test_3_YourProjects(self):
        self.assertTrue(element_exists(self.driver, "//div[@id='your-projects' and @class='card']"), "CAN NOT SEE YOUR PROJECTS WHEN LOGIN IN")
        self.assertTrue(element_exists(self.driver, "//button[@id='your-projects-button']"), "CAN NOT SEE YOUR PROJECTS BUTTON")
    def test_4_CreateNewProjects(self):
        input_elem = self.driver.find_element("xpath", "//input[@id='input-1' and @class='form-control']")
        button_elem = self.driver.find_element("xpath", "//button[@id='projects-create-button' and @class='btn btn-primary']")
        input_elem.send_keys("TEST CREATING FROM SELENIUM")
        button_elem.click()
        self.assertTrue(element_exists(self.driver, "//div[@id='create-new-project' and @class='card']"), "CAN NOT SEE CREATE NEW PROJECT")
        self.assertTrue(element_exists(self.driver, "//div[@id='create-new-project' and @class='card']"), "CAN NOT SEE CREATE NEW PROJECT")
    def test_5_Header(self):
        self.assertTrue(element_exists(self.driver, "//div[@id='projects-header' and @class='header pb-6 bg-success']"), "CAN NOT SEE PROJECT HEADER")
    """
    def test_LAST_close(self):
        time.sleep(1)
        self.driver.close()
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()
