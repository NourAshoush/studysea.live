package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.UserExtended;
import uk.ac.bham.teamproject.repository.UserExtendedRepository;

/**
 * Integration tests for the {@link UserExtendedResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class UserExtendedResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_INSTITUTION = "AAAAAAAAAA";
    private static final String UPDATED_INSTITUTION = "BBBBBBBBBB";

    private static final String DEFAULT_COURSE = "AAAAAAAAAA";
    private static final String UPDATED_COURSE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_PRIVACY = false;
    private static final Boolean UPDATED_PRIVACY = true;

    private static final Boolean DEFAULT_DARK_MODE = false;
    private static final Boolean UPDATED_DARK_MODE = true;

    private static final String ENTITY_API_URL = "/api/user-extendeds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserExtendedRepository userExtendedRepository;

    @Mock
    private UserExtendedRepository userExtendedRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserExtendedMockMvc;

    private UserExtended userExtended;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserExtended createEntity(EntityManager em) {
        UserExtended userExtended = new UserExtended()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .status(DEFAULT_STATUS)
            .institution(DEFAULT_INSTITUTION)
            .course(DEFAULT_COURSE)
            .description(DEFAULT_DESCRIPTION)
            .privacy(DEFAULT_PRIVACY)
            .darkMode(DEFAULT_DARK_MODE);
        return userExtended;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserExtended createUpdatedEntity(EntityManager em) {
        UserExtended userExtended = new UserExtended()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .status(UPDATED_STATUS)
            .institution(UPDATED_INSTITUTION)
            .course(UPDATED_COURSE)
            .description(UPDATED_DESCRIPTION)
            .privacy(UPDATED_PRIVACY)
            .darkMode(UPDATED_DARK_MODE);
        return userExtended;
    }

    @BeforeEach
    public void initTest() {
        userExtended = createEntity(em);
    }

    @Test
    @Transactional
    void createUserExtended() throws Exception {
        int databaseSizeBeforeCreate = userExtendedRepository.findAll().size();
        // Create the UserExtended
        restUserExtendedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userExtended)))
            .andExpect(status().isCreated());

        // Validate the UserExtended in the database
        List<UserExtended> userExtendedList = userExtendedRepository.findAll();
        assertThat(userExtendedList).hasSize(databaseSizeBeforeCreate + 1);
        UserExtended testUserExtended = userExtendedList.get(userExtendedList.size() - 1);
        assertThat(testUserExtended.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testUserExtended.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testUserExtended.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testUserExtended.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testUserExtended.getInstitution()).isEqualTo(DEFAULT_INSTITUTION);
        assertThat(testUserExtended.getCourse()).isEqualTo(DEFAULT_COURSE);
        assertThat(testUserExtended.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testUserExtended.getPrivacy()).isEqualTo(DEFAULT_PRIVACY);
        assertThat(testUserExtended.getDarkMode()).isEqualTo(DEFAULT_DARK_MODE);
    }

    @Test
    @Transactional
    void createUserExtendedWithExistingId() throws Exception {
        // Create the UserExtended with an existing ID
        userExtended.setId(1L);

        int databaseSizeBeforeCreate = userExtendedRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserExtendedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userExtended)))
            .andExpect(status().isBadRequest());

        // Validate the UserExtended in the database
        List<UserExtended> userExtendedList = userExtendedRepository.findAll();
        assertThat(userExtendedList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserExtendeds() throws Exception {
        // Initialize the database
        userExtendedRepository.saveAndFlush(userExtended);

        // Get all the userExtendedList
        restUserExtendedMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userExtended.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].institution").value(hasItem(DEFAULT_INSTITUTION)))
            .andExpect(jsonPath("$.[*].course").value(hasItem(DEFAULT_COURSE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].privacy").value(hasItem(DEFAULT_PRIVACY.booleanValue())))
            .andExpect(jsonPath("$.[*].darkMode").value(hasItem(DEFAULT_DARK_MODE.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUserExtendedsWithEagerRelationshipsIsEnabled() throws Exception {
        when(userExtendedRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUserExtendedMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(userExtendedRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUserExtendedsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(userExtendedRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUserExtendedMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(userExtendedRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getUserExtended() throws Exception {
        // Initialize the database
        userExtendedRepository.saveAndFlush(userExtended);

        // Get the userExtended
        restUserExtendedMockMvc
            .perform(get(ENTITY_API_URL_ID, userExtended.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userExtended.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.institution").value(DEFAULT_INSTITUTION))
            .andExpect(jsonPath("$.course").value(DEFAULT_COURSE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.privacy").value(DEFAULT_PRIVACY.booleanValue()))
            .andExpect(jsonPath("$.darkMode").value(DEFAULT_DARK_MODE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingUserExtended() throws Exception {
        // Get the userExtended
        restUserExtendedMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserExtended() throws Exception {
        // Initialize the database
        userExtendedRepository.saveAndFlush(userExtended);

        int databaseSizeBeforeUpdate = userExtendedRepository.findAll().size();

        // Update the userExtended
        UserExtended updatedUserExtended = userExtendedRepository.findById(userExtended.getId()).get();
        // Disconnect from session so that the updates on updatedUserExtended are not directly saved in db
        em.detach(updatedUserExtended);
        updatedUserExtended
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .status(UPDATED_STATUS)
            .institution(UPDATED_INSTITUTION)
            .course(UPDATED_COURSE)
            .description(UPDATED_DESCRIPTION)
            .privacy(UPDATED_PRIVACY)
            .darkMode(UPDATED_DARK_MODE);

        restUserExtendedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserExtended.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserExtended))
            )
            .andExpect(status().isOk());

        // Validate the UserExtended in the database
        List<UserExtended> userExtendedList = userExtendedRepository.findAll();
        assertThat(userExtendedList).hasSize(databaseSizeBeforeUpdate);
        UserExtended testUserExtended = userExtendedList.get(userExtendedList.size() - 1);
        assertThat(testUserExtended.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testUserExtended.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testUserExtended.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUserExtended.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testUserExtended.getInstitution()).isEqualTo(UPDATED_INSTITUTION);
        assertThat(testUserExtended.getCourse()).isEqualTo(UPDATED_COURSE);
        assertThat(testUserExtended.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testUserExtended.getPrivacy()).isEqualTo(UPDATED_PRIVACY);
        assertThat(testUserExtended.getDarkMode()).isEqualTo(UPDATED_DARK_MODE);
    }

    @Test
    @Transactional
    void putNonExistingUserExtended() throws Exception {
        int databaseSizeBeforeUpdate = userExtendedRepository.findAll().size();
        userExtended.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserExtendedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userExtended.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userExtended))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtended in the database
        List<UserExtended> userExtendedList = userExtendedRepository.findAll();
        assertThat(userExtendedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserExtended() throws Exception {
        int databaseSizeBeforeUpdate = userExtendedRepository.findAll().size();
        userExtended.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserExtendedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userExtended))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtended in the database
        List<UserExtended> userExtendedList = userExtendedRepository.findAll();
        assertThat(userExtendedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserExtended() throws Exception {
        int databaseSizeBeforeUpdate = userExtendedRepository.findAll().size();
        userExtended.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserExtendedMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userExtended)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserExtended in the database
        List<UserExtended> userExtendedList = userExtendedRepository.findAll();
        assertThat(userExtendedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserExtendedWithPatch() throws Exception {
        // Initialize the database
        userExtendedRepository.saveAndFlush(userExtended);

        int databaseSizeBeforeUpdate = userExtendedRepository.findAll().size();

        // Update the userExtended using partial update
        UserExtended partialUpdatedUserExtended = new UserExtended();
        partialUpdatedUserExtended.setId(userExtended.getId());

        partialUpdatedUserExtended.email(UPDATED_EMAIL).description(UPDATED_DESCRIPTION).privacy(UPDATED_PRIVACY);

        restUserExtendedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserExtended.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserExtended))
            )
            .andExpect(status().isOk());

        // Validate the UserExtended in the database
        List<UserExtended> userExtendedList = userExtendedRepository.findAll();
        assertThat(userExtendedList).hasSize(databaseSizeBeforeUpdate);
        UserExtended testUserExtended = userExtendedList.get(userExtendedList.size() - 1);
        assertThat(testUserExtended.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testUserExtended.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testUserExtended.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUserExtended.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testUserExtended.getInstitution()).isEqualTo(DEFAULT_INSTITUTION);
        assertThat(testUserExtended.getCourse()).isEqualTo(DEFAULT_COURSE);
        assertThat(testUserExtended.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testUserExtended.getPrivacy()).isEqualTo(UPDATED_PRIVACY);
        assertThat(testUserExtended.getDarkMode()).isEqualTo(DEFAULT_DARK_MODE);
    }

    @Test
    @Transactional
    void fullUpdateUserExtendedWithPatch() throws Exception {
        // Initialize the database
        userExtendedRepository.saveAndFlush(userExtended);

        int databaseSizeBeforeUpdate = userExtendedRepository.findAll().size();

        // Update the userExtended using partial update
        UserExtended partialUpdatedUserExtended = new UserExtended();
        partialUpdatedUserExtended.setId(userExtended.getId());

        partialUpdatedUserExtended
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .status(UPDATED_STATUS)
            .institution(UPDATED_INSTITUTION)
            .course(UPDATED_COURSE)
            .description(UPDATED_DESCRIPTION)
            .privacy(UPDATED_PRIVACY)
            .darkMode(UPDATED_DARK_MODE);

        restUserExtendedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserExtended.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserExtended))
            )
            .andExpect(status().isOk());

        // Validate the UserExtended in the database
        List<UserExtended> userExtendedList = userExtendedRepository.findAll();
        assertThat(userExtendedList).hasSize(databaseSizeBeforeUpdate);
        UserExtended testUserExtended = userExtendedList.get(userExtendedList.size() - 1);
        assertThat(testUserExtended.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testUserExtended.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testUserExtended.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUserExtended.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testUserExtended.getInstitution()).isEqualTo(UPDATED_INSTITUTION);
        assertThat(testUserExtended.getCourse()).isEqualTo(UPDATED_COURSE);
        assertThat(testUserExtended.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testUserExtended.getPrivacy()).isEqualTo(UPDATED_PRIVACY);
        assertThat(testUserExtended.getDarkMode()).isEqualTo(UPDATED_DARK_MODE);
    }

    @Test
    @Transactional
    void patchNonExistingUserExtended() throws Exception {
        int databaseSizeBeforeUpdate = userExtendedRepository.findAll().size();
        userExtended.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserExtendedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userExtended.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userExtended))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtended in the database
        List<UserExtended> userExtendedList = userExtendedRepository.findAll();
        assertThat(userExtendedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserExtended() throws Exception {
        int databaseSizeBeforeUpdate = userExtendedRepository.findAll().size();
        userExtended.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserExtendedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userExtended))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtended in the database
        List<UserExtended> userExtendedList = userExtendedRepository.findAll();
        assertThat(userExtendedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserExtended() throws Exception {
        int databaseSizeBeforeUpdate = userExtendedRepository.findAll().size();
        userExtended.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserExtendedMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userExtended))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserExtended in the database
        List<UserExtended> userExtendedList = userExtendedRepository.findAll();
        assertThat(userExtendedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserExtended() throws Exception {
        // Initialize the database
        userExtendedRepository.saveAndFlush(userExtended);

        int databaseSizeBeforeDelete = userExtendedRepository.findAll().size();

        // Delete the userExtended
        restUserExtendedMockMvc
            .perform(delete(ENTITY_API_URL_ID, userExtended.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserExtended> userExtendedList = userExtendedRepository.findAll();
        assertThat(userExtendedList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
