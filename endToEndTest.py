import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

def element_exists(driver, text):
    """If driver.find_element can not find element then it will crash"""
    try:
        driver.find_element("xpath", text)
        return True
    except:
        return False



class TestLogin(unittest.TestCase):
    driver = webdriver.Chrome()
    driver.get("http://dev-editor.kexxu.com:8081/#/auth/login")

    def test_1_login(self):
        time.sleep(1)
        email_elem = self.driver.find_element("xpath", "//input[@id='form-email']")
        password_elem = self.driver.find_element("xpath", "//input[@id='form-password']")
        button_elem = self.driver.find_element("xpath", "//button[@id='form-button']")

        email_elem.send_keys("test@gmail.com")
        password_elem.send_keys("testing")
        button_elem.click()
        time.sleep(1)
        self.assertTrue(self.driver.current_url == "http://dev-editor.kexxu.com:8081/#/projects", "CAN NOT SEE LOGIN IN ATLEAST BROWSER DOES NOT REDIRECT TO http://dev-editor.kexxu:8081/#/projects")
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
    def test_LAST_close(self):
        time.sleep(1)
        self.driver.close()
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()
